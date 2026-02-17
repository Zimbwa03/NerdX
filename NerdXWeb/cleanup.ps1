$filePath = 'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXWeb\src\data\oLevelMath\form3Notes.ts'
$lines = [System.IO.File]::ReadAllLines($filePath, [System.Text.Encoding]::UTF8)
Write-Host "Before cleanup: $($lines.Count) lines"

# Find the Polygons section comment (0-indexed)
$polygonsStart = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "'F3 Properties of Polygons'") {
        # The section starts 2 lines before (the comment separators)
        $polygonsStart = $i - 2
        break
    }
}

# Find where the new Bearings closing brace is (},  after visual_descriptions)
$bearingsEnd = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Trim() -eq '},' -and $i -gt 1200 -and $i -lt $polygonsStart) {
        # Check if the line before is ] (closing visual_descriptions or similar)
        if ($lines[$i - 1].Trim() -eq ']') {
            $bearingsEnd = $i
        }
    }
}

Write-Host "New Bearings ends at 0-idx: $bearingsEnd (line $($bearingsEnd+1): $($lines[$bearingsEnd].Trim()))"
Write-Host "Polygons section starts at 0-idx: $polygonsStart (line $($polygonsStart+1): $($lines[$polygonsStart].Substring(0, [Math]::Min(60, $lines[$polygonsStart].Length))))"

# Keep lines 0..bearingsEnd + blank line + polygonsStart..end
$result = New-Object System.Collections.ArrayList
$result.AddRange($lines[0..$bearingsEnd])
$result.Add('')
$result.AddRange($lines[$polygonsStart..($lines.Count - 1)])

$output = $result.ToArray()
[System.IO.File]::WriteAllLines($filePath, $output, (New-Object System.Text.UTF8Encoding $true))
Write-Host "After cleanup: $($output.Count) lines"
