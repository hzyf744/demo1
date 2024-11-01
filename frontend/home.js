document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', addProduct);
    
    const toggleSidebarButton = document.getElementById('toggleSidebar');
    const closeSidebarButton = document.getElementById('closeSidebar');

    toggleSidebarButton.addEventListener('click', toggleSidebar);
    closeSidebarButton.addEventListener('click', closeSidebar);
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('closed');  
    const isClosed = sidebar.classList.contains('closed');
    const buttonText = isClosed ? '☰' : '✖'; 
    document.getElementById('toggleSidebar').textContent = buttonText;
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('closed'); 
    document.getElementById('toggleSidebar').textContent = '☰'; 
}

function fetchProducts() {
    fetch('/products')  
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('productList');
            productList.innerHTML = '';  
            data.forEach(product => {
                const li = document.createElement('li');
                li.textContent = `${product.product_name} - ${product.product_description} - ${product.product_price} TL - ${product.product_quantity} Adet`;
                productList.appendChild(li);
            });
        })
        .catch(error => console.error('Hata:', error));
}

function addProduct(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const productQuantity = document.getElementById('productQuantity').value;

    fetch('/add-product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            product_name: productName,  
            product_description: productDescription,  
            product_price: parseFloat(productPrice),  
            product_quantity: parseInt(productQuantity) 
        })
    })
    .then(response => response.json())
    .then(data => {
        
        if (data.message) {  
            fetchProducts();  
            document.getElementById('productForm').reset();  
            document.getElementById('notification').textContent = 'Ürün başarıyla eklendi!';
        }
    })
    .catch(error => {
        console.error('Hata:', error);
        document.getElementById('notification').textContent = 'Ürün eklenirken hata oluştu!';
    });
}

