<html>
<body>

<?php

$pythonCmd = "./tag-mega-link.py";
    foreach ($_POST as $key => $value) { 
        $pythonCmd.= " \"" . htmlspecialchars($key) . "\" \"" . htmlspecialchars($value) . "\"";
    }
    echo "$pythonCmd";
    $command = escapeshellcmd($pythonCmd);
    $output = shell_exec($command);
    echo "$output";
?>

</body>
</html>