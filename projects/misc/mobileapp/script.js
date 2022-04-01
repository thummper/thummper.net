function tabpress(tab){
	//Handles tab & info swapping.
	console.log("tab pressed");
	
	var tabContent = document.getElementsByClassName("phoneTab");
	var tabButtons = document.getElementsByClassName("tab");
	var infoSections = document.getElementsByClassName("info");
	
	for(i = 0; i < tabButtons.length; i++){
		var tabsel = tabButtons[i];
		if(i + 1 == tab){
			tabsel.classList.add("activeTab");
		} else {
			if(tabsel.classList.contains("activeTab")){
				tabsel.classList.remove("activeTab");
			}
		}
	}
	
	for(i = 0; i < infoSections.length; i++){
		var info = infoSections[i];
		if(i + 1 == tab){
			info.style.display = "flex";
		} else {
			info.style.display = "none";	
		}
		
	}
	
	for(i = 0; i < tabContent.length; i++){
		var tabsel = tabContent[i];
		if(i + 1 == tab){
			tabsel.style.display = "flex";	
		} else {
			tabsel.style.display = "none";	
		}
		
	}
	
}