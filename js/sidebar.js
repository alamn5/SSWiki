const sidebar = document.getElementById('sidebar')
const toggleButton = document.getElementById('toggle-btn')

function toggleSideBar(button){
   sidebar.classList.toggle('close') //on off with toggle <-- close is 'made' with the css 
   //toggleButton.classList.toggle('rotate')
   sidebar.getElementsByClassName('show')
}

function toggleSubMenu(button){
    button.nextElementSibling.classList.toggle('show') //sibling is for adjacent elements, so next element in the toggle menu on the same level
    //button.classList.toggle('rotate')

    if(sidebar.classList.contains('close')){
        sidebar.classList.toggle('close')
        //toggleButton.classList.toggle('rotate')
    }
}

//these lines make it accessible to html since thats where we call the func in button onclick=togglesidebar()
window.toggleSideBar = toggleSideBar;
window.toggleSubMenu = toggleSubMenu;