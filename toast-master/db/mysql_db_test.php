<?php

$con=mysqli_connect("127.0.0.1","magendas","RubyAndWonder!1","magendas");

// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$result = mysqli_query($con,"SELECT * FROM MA_NEWS");

while($row = mysqli_fetch_array($result)) {
  echo $row['title'] . " " . $row['content'];
  echo "<br>";
}

mysqli_close($con);
?>