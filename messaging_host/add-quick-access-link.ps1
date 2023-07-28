
$folderName=$args[0]
# write-host $folderName
$o = new-object -com shell.application
$o.Namespace($folderName).Self.InvokeVerb("pintohome")