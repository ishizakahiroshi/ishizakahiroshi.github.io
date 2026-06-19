[CmdletBinding(DefaultParameterSetName = 'Remote')]
param(
    [Parameter(ParameterSetName = 'Remote')]
    [ValidateNotNullOrEmpty()]
    [string] $FeedUrl = 'https://note.com/ishizakahiroshi/rss',

    [Parameter(Mandatory, ParameterSetName = 'File')]
    [ValidateScript({ Test-Path -LiteralPath $_ -PathType Leaf })]
    [string] $InputFile,

    [ValidateNotNullOrEmpty()]
    [string] $OutputPath = (Join-Path $PSScriptRoot '..\assets\latest-note.json')
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Get-RequiredText {
    param(
        [Parameter(Mandatory)] [System.Xml.XmlNode] $Node,
        [Parameter(Mandatory)] [string] $XPath,
        [Parameter(Mandatory)] [string] $Name
    )

    $valueNode = $Node.SelectSingleNode($XPath)
    $value = if ($null -eq $valueNode) { '' } else { $valueNode.InnerText.Trim() }
    if ([string]::IsNullOrWhiteSpace($value)) {
        throw "RSS item is missing required field: $Name"
    }
    return $value
}

function ConvertTo-Excerpt {
    param([AllowEmptyString()] [string] $Html)

    $withoutTags = [regex]::Replace($Html, '<[^>]+>', ' ')
    $decoded = [System.Net.WebUtility]::HtmlDecode($withoutTags)
    $normalized = [regex]::Replace($decoded, '\s+', ' ').Trim()
    $normalized = [regex]::Replace($normalized, '\s*続きをみる\s*$', '').Trim()
    if ($normalized.Length -le 180) {
        return $normalized
    }
    return $normalized.Substring(0, 179).TrimEnd() + '…'
}

function Assert-HttpsUrl {
    param(
        [Parameter(Mandatory)] [string] $Value,
        [Parameter(Mandatory)] [string] $Name,
        [string[]] $AllowedHosts = @()
    )

    $uri = $null
    if (-not [System.Uri]::TryCreate($Value, [System.UriKind]::Absolute, [ref] $uri) -or $uri.Scheme -ne 'https') {
        throw "$Name must be an absolute HTTPS URL."
    }
    if ($AllowedHosts.Count -gt 0 -and $uri.Host -notin $AllowedHosts) {
        throw "$Name host is not allowed: $($uri.Host)"
    }
    return $uri.AbsoluteUri
}

try {
    if ($PSCmdlet.ParameterSetName -eq 'File') {
        $rssText = [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $InputFile))
        $source = 'file:test-fixture'
    }
    else {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $FeedUrl -TimeoutSec 30
        $rssText = $response.Content
        $source = $FeedUrl
    }

    $xml = [xml] $rssText
    $items = @($xml.SelectNodes('/rss/channel/item'))
    if ($items.Count -eq 0) {
        throw 'RSS contains no items.'
    }

    $datedItems = foreach ($item in $items) {
        $dateText = Get-RequiredText -Node $item -XPath './pubDate' -Name 'pubDate'
        $published = [DateTimeOffset]::MinValue
        if (-not [DateTimeOffset]::TryParse(
            $dateText,
            [System.Globalization.CultureInfo]::InvariantCulture,
            [System.Globalization.DateTimeStyles]::AllowWhiteSpaces,
            [ref] $published
        )) {
            throw "RSS item has an invalid pubDate: $dateText"
        }
        [pscustomobject]@{ Node = $item; Published = $published }
    }

    $latest = $datedItems | Sort-Object Published -Descending | Select-Object -First 1
    $item = $latest.Node
    $title = Get-RequiredText -Node $item -XPath './title' -Name 'title'
    $articleUrl = Assert-HttpsUrl `
        -Value (Get-RequiredText -Node $item -XPath './link' -Name 'link') `
        -Name 'article URL' `
        -AllowedHosts @('note.com')
    $imageUrl = Assert-HttpsUrl `
        -Value (Get-RequiredText -Node $item -XPath "./*[local-name()='thumbnail']" -Name 'media:thumbnail') `
        -Name 'thumbnail URL' `
        -AllowedHosts @('assets.st-note.com', 'd2l930y2yx77uc.cloudfront.net')

    $descriptionNode = $item.SelectSingleNode('./description')
    $description = ConvertTo-Excerpt $(if ($null -eq $descriptionNode) { '' } else { $descriptionNode.InnerText })
    $publishedAt = $latest.Published.ToUniversalTime().ToString('o')
    $resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)

    $content = [ordered]@{
        title       = $title
        url         = $articleUrl
        publishedAt = $publishedAt
        description = $description
        imageUrl    = $imageUrl
        source      = $source
    }

    if (Test-Path -LiteralPath $resolvedOutput -PathType Leaf) {
        try {
            $existing = Get-Content -Raw -LiteralPath $resolvedOutput | ConvertFrom-Json
            $unchanged = $true
            foreach ($key in $content.Keys) {
                $existingProperty = $existing.PSObject.Properties[$key]
                $sameValue = $null -ne $existingProperty
                if ($sameValue -and $key -eq 'publishedAt') {
                    $sameValue = ([DateTimeOffset] $existingProperty.Value).ToUniversalTime() -eq
                        ([DateTimeOffset] $content[$key]).ToUniversalTime()
                }
                elseif ($sameValue) {
                    $sameValue = [string] $existingProperty.Value -ceq [string] $content[$key]
                }
                if (-not $sameValue) {
                    $existingValue = if ($null -eq $existingProperty) { '<missing>' } else { $existingProperty.Value }
                    Write-Verbose "Changed field '$key': existing='$existingValue' new='$($content[$key])'"
                    $unchanged = $false
                    break
                }
            }
            if ($unchanged -and $null -ne $existing.fetchedAt) {
                Write-Host 'Latest note is unchanged; keeping the existing JSON.'
                exit 0
            }
        }
        catch {
            Write-Warning "Existing JSON could not be compared and will be replaced: $($_.Exception.Message)"
        }
    }

    $output = [ordered]@{
        title       = $content.title
        url         = $content.url
        publishedAt = $content.publishedAt
        description = $content.description
        imageUrl    = $content.imageUrl
        fetchedAt   = [DateTimeOffset]::UtcNow.ToString('o')
        source      = $content.source
    }
    $json = $output | ConvertTo-Json -Depth 3
    $outputDirectory = Split-Path -Parent $resolvedOutput
    [System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null
    [System.IO.File]::WriteAllText(
        $resolvedOutput,
        $json + [Environment]::NewLine,
        [System.Text.UTF8Encoding]::new($false)
    )
    Write-Host "Updated $resolvedOutput"
}
catch {
    Write-Error "Latest note update failed. Existing JSON was not changed. $($_.Exception.Message)"
    exit 1
}
