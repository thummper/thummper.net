<?php
$config = parse_ini_file('liveconfig.ini');
$host = "."; 
$URLS = [
		'/assets/nebulas/nebula_compressed.webp',
		'/assets/nebulas/nebula-1_compressed.webp',
		'/assets/nebulas/nebula-2_compressed.webp',
		'/assets/nebulas/nebula-3_compressed.webp',
		'/assets/nebulas/nebula-4_compressed.webp',
		'/assets/nebulas/nebula-5_compressed.webp',
		'/assets/nebulas/nebula-6_compressed.webp',
		'/assets/nebulas/nebula-7_compressed.webp',
		'/assets/nebulas/nebula-8_compressed.webp',
		'/assets/nebulas/nebula-9_compressed.webp',
		'/assets/nebulas/nebula-10_compressed.webp',
		'/assets/nebulas/nebula-11_compressed.webp',
		
	];

$conn = new mysqli('localhost', $config['username'], $config['password'], $config['dbname']);
if($conn -> connect_error) {
	die("Connection Failed: " . $conn->connect_error);
}

$SQL = "SELECT *
		FROM projects
		INNER JOIN project_types ON projects.type=project_types.type_id";
$results = $conn->query($SQL);


function makeCard($image, $shortDesc, $typeName, $name){
	$card = "";
	global $URLS;
	$image = $URLS[$image];
	$className = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $typeName)));

	$card .= " <div class='gridItem $className' style='background-image: url(.$image);'>";
	$card .= " <div class='projectTitle'>$name</div>";
	// Hover Div
	$card .= " <div class='projectHover'>";

	$card .= " <div class='projectFlavour'>$shortDesc</div>";
	$card .= " <div class='projectMore'>Read More</div>";
	$card .= " </div>";
	// End Hover
	$card .= " </div> ";

	return $card;
}




function makeModal($desc, $typeName, $name, $link){
	$modal = "";

	$modal .= "<div class='modal'>";
	$modal .= "<div class='modalContent'>";

	$modal .= "<div class='modalHeader'>";
	$modal .= "<h2> $name </h2>";
	$modal .= "<span class='close'>&times;</span>";
	$modal .= "</div>";

	$modal .= "<div class='modalBody'>";
	$modal .= "<div class='modalSmallTitle'> Project Type </div>";
	$modal .= "<div class='" . str_replace(' ', '-', strtolower($typeName)) . "'>" . $typeName . "</div>";

	$modal .= "<div class='modalSmallTitle'> Description </div>";
	$modal .= "<p>$desc</p>";


	$modal .= "<a class='modalLink' href='$link'> View Project</a>";

	
	$modal .= "</div>";

	$modal .= "<div class='modalFooter'>";
	$modal .= "</div>";

	$modal .= "</div>";
	$modal .= "</div>";

	return $modal;
}


$cards  = [];
$modals = [];
if($results->num_rows > 0){
	while($row = $results->fetch_assoc()){
		$typeName  = $row['type_name'];
		$name      = $row['name'];
		$shortDesc = $row['short_desc']; // For card
		$desc      = $row['description']; // For modal

		$link = $row['internal_link'];
		if( strlen($row['external_link']) > 1 ){
			$link = "https://" . $row['external_link'];
		}
		// Random image for card
		$image    = array_rand($URLS);
		
		$cards[]  = makeCard($image, $shortDesc, $typeName, $name);
		unset($URLS[$image]);
		$modals[] = makeModal($desc, $typeName, $name, $link);
	}

	$SQL = "SELECT * FROM project_types";
	$results = $conn->query($SQL);
	$filterNames = [];
	if($results->num_rows > 0){
		while($row = $results->fetch_assoc()){
			$filterNames[] = $row['type_name'];
		}
	}

	// Make filter buttons
	echo "<div class='filterWrapper'>";
	echo "<button data-filter='*' " . ">All</button>";
	foreach($filterNames as $filterName){
		$slugName = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $filterName)));
		echo "<button data-filter='.$slugName' " . ">$filterName</button>";
	}
	echo "</div>";

	// Make project grid
	echo "<div class='projectGrid'>";
	foreach($cards as $card){
		echo $card;
	}
	echo "</div>";

	echo "<div class='modalsWrapper'>";
	foreach($modals as $modal){
		echo $modal;
	}
	echo "</div>";



}



