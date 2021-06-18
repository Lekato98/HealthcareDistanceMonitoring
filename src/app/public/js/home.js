const healthText = document.querySelector('#healthStatus');
console.log(healthText);

if (healthText.textContent === 'Excellent'){
    healthText.style.color='#28a745';
} else if (healthText.textContent === 'Very Good'){
    healthText.style.color='#3f6d3b';
}else if (healthText.textContent === 'Good'){
    healthText.style.color='#ffc107';
}else if (healthText.textContent === 'bad'){
    healthText.style.color='#E48900';
}else if (healthText.textContent === 'Needs Hospitalization'){
    healthText.style.color='#dc3545';
}