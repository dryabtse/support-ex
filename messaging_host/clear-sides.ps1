$folderName=$args[0]

Write-Output $folderName

if ($folderName.lastIndexOf("\") -gt 0) {
    $QuickAccess = New-Object -ComObject shell.application
    $QuickAccess.Namespace("shell:::{679f85cb-0220-4080-b29b-5540cc05aab6}").Items() | where {$_.Path.Contains($folderName)} | % { $_.InvokeVerb("unpinfromhome") }
}
