<?php
include_once "../global_tools.php";
$lastUpdate = "22-07-02-0000"; // when changing this, you should also update sw.js
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

    <link rel="manifest" href="timing.webmanifest">
    <meta name="theme-color" content="#0d6efd"/>
    <link rel="apple-touch-icon" href="/maskable_icon_x192.png">
</head>
<body>


<header>
	<h1>Timing trainer</h1>
    <a id="githubLink" class="btn btn-primary" href="https://github.com/adil192/timing-pwa" title="GitHub project" aria-label="GitHub project" style="display: none;">
        <img src="/assets/images/logos/GitHub-Mark.svg" width="121" height="118" aria-hidden="true">
    </a>
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
    <label for="guessesRange" class="guessesLabel">How long does the square above appear?</label>
    <input id="guessesRange" type="range"
           min="<?=1000/60?>" max="500.01" step="<?=1000/60?>" value="250"
           style="width: 100%">
    <div id="guessesRow">
        <button class="btn btn-primary" id="guessesSubmit">Submit</button>
        <p id="guessesValue">250ms</p>
    </div>
</footer>


<script src="timing.js?lastUpdate=<?=$lastUpdate?>" type="module"></script>
</body>
</html>
