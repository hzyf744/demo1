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
                li.innerHTML = `
                    ${product.product_name} - ${product.product_description} - ${product.product_price} TL - ${product.product_quantity} Adet
                    <button onclick="editProduct(${product.id}, '${product.product_name}', '${product.product_description}', ${product.product_price}, ${product.product_quantity})">Düzenle</button>
                    <button onclick="deleteProduct(${product.id})">Sil</button>
                `;
                productList.appendChild(li);
            });
        })
        .catch(error => console.error('Hata:', error));
}

function deleteProduct(id) {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
        fetch(`/delete-product/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchProducts();  
        })
        .catch(error => console.error('Hata:', error));
    }
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

function editProduct(id, name, description, price, quantity) {
    document.getElementById('productName').value = name;
    document.getElementById('productDescription').value = description;
    document.getElementById('productPrice').value = price;
    document.getElementById('productQuantity').value = quantity;

    const productForm = document.getElementById('productForm');
    productForm.onsubmit = (event) => {
        event.preventDefault();
        updateProduct(id);
    };
}

function updateProduct(id) {
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const productQuantity = document.getElementById('productQuantity').value;

    fetch(`/update-product/${id}`, {
        method: 'PUT',
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
            document.getElementById('notification').textContent = 'Ürün başarıyla güncellendi!';
        }
    })
    .catch(error => {
        console.error('Hata:', error);
        document.getElementById('notification').textContent = 'Ürün güncellenirken hata oluştu!';
    });
}

