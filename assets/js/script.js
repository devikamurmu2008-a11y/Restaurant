/* =======  Mobile Menu Toggle  ======= */
const menuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if(menuBtn){
  menuBtn.addEventListener('click',()=>{
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true' || false;
    menuBtn.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('open');
  });
}

/* =======  Menu Page Filtering  ======= */
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems  = document.querySelectorAll('.menu-item');

filterBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    menuItems.forEach(item=>{
      if(filter==='all' || item.dataset.filter.includes(filter)){
        item.style.display='block';
      }else{
        item.style.display='none';
      }
    });
  });
});

/* =======  Simple Client-Side Form Validation  ======= */
const forms = document.querySelectorAll('form');
forms.forEach(form=>{
  form.addEventListener('submit',e=>{
    let valid = true;
    form.querySelectorAll('[required]').forEach(input=>{
      const errorBox = document.getElementById(`${input.id}-error`);
      if(!input.value.trim()){
        valid = false;
        errorBox.textContent = 'Required';
      }else{
        errorBox.textContent = '';
      }
    });
    if(!valid) e.preventDefault();
  });
});
