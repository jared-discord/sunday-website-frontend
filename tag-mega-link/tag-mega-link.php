<html>
<body>

artist: <?php echo $_POST["artist"]; ?><br>
album: <?php echo $_POST["album"]; ?><br>
year: <?php echo $_POST["year"]; ?><br>
file type: <?php echo $_POST["filetype"]; ?><br>
description: <?php echo $_POST["description"]; ?><br>

results: <?php 
    $command = escapeshellcmd('./tag-mega-link.py');
    $output = shell_exec($command);
    echo "$output";
?>

</body>
</html>