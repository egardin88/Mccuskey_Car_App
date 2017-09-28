<?php

	include_once "database.php";

	if (isset($_POST["phpFunction"]) && !empty($_POST["phpFunction"]))
	{
		$function = $_POST["phpFunction"];
		$lastLoadedVehicleId = $_POST["lastLoadedVehicleId"];

		//The limit for how many database rows get loaded at once
		$limit = $_POST["limit"];

		$searchParams = $_POST["searchParams"];

		switch ($function)
		{
			case "displayVehicles" : displayVehicles($lastLoadedVehicleId, $searchParams, $limit, $conn); break;
		}
	}

	function displayVehicles($lastLoadedVehicleId, $searchParams, $limit, $conn) 
	{	
		$stockSearch = createSearchQuery($searchParams, "stock_id");
		$descriptionSearch = createSearchQuery($searchParams, "description");
		
		try 
		{	
			$selectQuery = "SELECT * FROM vehicles WHERE ($stockSearch OR $descriptionSearch) AND (id > $lastLoadedVehicleId) ORDER BY id LIMIT $limit";
			
			$statement = $conn->query($selectQuery);

			$counter = 1;

			if($statement->rowCount() > 0)
			{
				while ($selectedVehicle = $statement->fetch(PDO::FETCH_OBJ))
				{	
					$id = $selectedVehicle->id;
					$stockId = $selectedVehicle->stock_id;
					$description = $selectedVehicle->description;
					$image = "http://192.168.1.12/Mccluskey_Car_App/" . $selectedVehicle->thumbnail;
				
					$output = "
								<div class=\"col-sm-6\">

									<div id=\"vehicleId~$id\" class=\"card\">

										<img class=\"card-img-top\" src=\"$image\" alt=\"...\">

										<div class=\"card-body\">
										
											<div class=\"row right-padding-5 left-padding-5\">
									
												<p class=\"card-title-text\">$description $id<p>

											</div>

											<div class=\"row right-padding-5 left-padding-5\">
									
												<button id=\"selectVehicle~$id\" class=\"card-button description-text\">SELECT</button>

											</div>

										</div>

									</div>
								
								</div>";
				
					echo $output;
				}
			}
			else
			{
				echo "
						<div class=\"col-sm-12\">

							<p class=\"description-text\">No results found</p>
							
						</div>";
			}
		}
		catch (PDOException $ex)
		{
			//echo "An error has occurred".$ex->getMessage();
		}
	}

	function createSearchQuery($searchParams, $columnSearch)
	{
		$searchArray = explode(" ", $searchParams);

		$search = "";

		foreach($searchArray as $word)
		{
			$search .= " $columnSearch LIKE '%" . $word . "%' AND";
		}

		$search = substr($search, 0, -3);

		return $search;
	}
?>