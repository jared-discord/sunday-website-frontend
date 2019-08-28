<html>
<body>

artist: <?php echo $_POST["artist"]; ?><br>
album: <?php echo $_POST["album"]; ?><br>
year: <?php echo $_POST["year"]; ?><br>
file type: <?php echo $_POST["filetype"]; ?><br>

<?php 
    $command = escapeshellcmd('hello.py');
    $output = shell_exec($command);
    echo "$output";
?>

</body>
</html>