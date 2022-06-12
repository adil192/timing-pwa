<?php
include_once "../global_tools.php";
$lastUpdate = "22-06-06-1600"; // when changing this, you should also update sw.js
?>
<!doctype html>
<html lang="en">
<head>
	<?php createHead(
		"Timing trainer",
		"Learn to identify sub-second timing intervals.",
        null,
		null,
		"2022-06-06",
		"InteractiveResource",
		false
	); ?>

	<link rel="stylesheet" href="/assets/ext/bootstrap.5.1.3.min.css" />
	<link rel="stylesheet" href="timing.css?lastUpdate=<?=$lastUpdate?>">
</head>
<body>


<header>
	<h1>Timing trainer</h1>
</header>

<main>
    <square>
        <h2></h2>
        <p></p>
    </square>
</main>

<footer>
    <p class="flashingWarning">Warning: This demo contains flashing images. A small percentage of
        people may experience seizures when exposed to certain lights,
        patterns or images, even with no history of epilepsy or seizures.</p>
    <p class="guessesLabel">How long does the square above appear?</p>
    <div id="guessesRow">
	    <?php for ($ms = 1000/60; $ms < 1000; $ms += 1000/60) { ?>
            <button class="btn btn-primary"><?=floor($ms)?>ms</button>
	    <?php } ?>
    </div>
</footer>


<script src="timing.js?lastUpdate=<?=$lastUpdate?>" type="module"></script>
</body>
</html>
