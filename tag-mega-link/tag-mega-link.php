<html>
<body>

artist: <?php echo $_POST["artist"]; ?><br>
album: <?php echo $_POST["album"]; ?><br>
year: <?php echo $_POST["year"]; ?><br>
file type: <?php echo $_POST["filetype"]; ?><br>
genre: <?php echo $_POST["genre"]; ?><br>
description: <?php echo $_POST["description"]; ?><br>

results: <?php 
    $pythonCmd = "./tag-mega-link.py " . $_POST["artist"] . " " . $_POST["album"] . " " . $_POST["filetype"] . " " . $_POST["year"] . " " . $_POST["genre"] . " " . $_POST["description"];
    $command = escapeshellcmd($pythonCmd);
    $output = shell_exec($command);
    echo "$output";
?>

</body>
</html>