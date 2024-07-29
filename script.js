// Espera a que el contenido del DOM se haya cargado completamente antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los elementos de la lista de productos
    const products = document.querySelectorAll('.product-list li');
    // Selecciona el área de comparación donde se soltarán los productos
    const comparisonArea = document.getElementById('comparison-area');
    // Selecciona el botón de comparar
    const compareBtn = document.getElementById('compare-btn');
    // Selecciona el botón de refrescar
    const refreshBtn = document.getElementById('refresh-btn');

    // Inicializa un array vacío para almacenar los productos seleccionados
    let selectedProducts = [];

    // Agrega un evento de arrastrar a cada producto
    products.forEach(product => {
        product.addEventListener('dragstart', (e) => {
            // Al empezar a arrastrar, guarda los datos del producto en el objeto DataTransfer
            e.dataTransfer.setData('text/plain', JSON.stringify({
                nombre: e.target.dataset.nombre,
                tipo: e.target.dataset.tipo
            }));
        });
    });

    // Agrega un evento para cuando un elemento se arrastra sobre el área de comparación
    comparisonArea.addEventListener('dragover', (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado para permitir el drop
        comparisonArea.classList.add('over'); // Agrega una clase para estilizar el área cuando se arrastra sobre ella
    });

    // Agrega un evento para cuando un elemento deja de ser arrastrado sobre el área de comparación
    comparisonArea.addEventListener('dragleave', () => {
        comparisonArea.classList.remove('over'); // Quita la clase de estilizado
    });

    // Agrega un evento para cuando un elemento es soltado en el área de comparación
    comparisonArea.addEventListener('drop', (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del drop
        comparisonArea.classList.remove('over'); // Quita la clase de estilizado
        // Obtiene los datos del producto desde el objeto DataTransfer y los parsea a un objeto
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));

        // Comprueba si ya hay dos productos seleccionados
        if (selectedProducts.length < 2) {
            // Comprueba si ya hay un producto del mismo tipo seleccionado
            if (selectedProducts.some(product => product.tipo === data.tipo)) {
                alert('No puede comparar productos del mismo tipo.'); // Muestra una alerta si son del mismo tipo
                return;
            }
            selectedProducts.push(data); // Añade el producto al array de seleccionados
            // Encuentra el elemento del producto en la lista original y lo oculta
            const productElement = document.querySelector(`li[data-nombre="${data.nombre}"]`);
            productElement.style.display = 'none';
            // Crea un nuevo nodo para mostrar el producto en el área de comparación
            const productNode = document.createElement('p');
            productNode.textContent = `${data.nombre} (${data.tipo})`;
            comparisonArea.appendChild(productNode); // Añade el nodo al área de comparación
        }
    });

    // Agrega un evento para el botón de comparar
    compareBtn.addEventListener('click', () => {
        // Comprueba si hay dos productos seleccionados
        if (selectedProducts.length === 2) {
            const [product1, product2] = selectedProducts; // Desestructura los productos seleccionados
            // Comprueba la compatibilidad de los productos
            const compatibility = checkCompatibility(product1.nombre, product2.nombre);
            alert(`Los productos ${compatibility ? 'son' : 'no son'} compatibles.`); // Muestra una alerta con el resultado
        } else {
            alert('Por favor, seleccione dos productos de diferentes tipos.'); // Muestra una alerta si no hay dos productos seleccionados
        }
    });

    // Agrega un evento para el botón de refrescar
    refreshBtn.addEventListener('click', () => {
        location.reload(); // Recarga la página
    });

    // Función para comprobar la compatibilidad de dos productos
    function checkCompatibility(product1, product2) {
        // Datos de compatibilidad: cada producto compatible tiene una lista de productos compatibles
        const compatibilityData = {
            'Metalaxil + Propamocarb': ['Clorpirifos + Cipermetrina', 'Deltrametrina', 'Lambda-chyhalotrin', 'Imidacloprid', 'Malathion'],
            'Tebuconazol': ['Lambda-chyhalotrin', 'Imidacloprid'],
            'Dimetimorph': ['Clorpirifos + Cipermetrina', 'Deltrametrina', 'Lambda-chyhalotrin', 'Imidacloprid', 'Malathion'],
            'Difeconazole': ['Clorpirifos + Cipermetrina', 'Deltrametrina', 'Lambda-chyhalotrin', 'Imidacloprid', 'Malathion'],
            'Azoxystrobin': ['Clorpirifos + Cipermetrina', 'Deltrametrina', 'Lambda-chyhalotrin', 'Imidacloprid', 'Malathion'],
            'Clorotalonil': ['Clorpirifos + Cipermetrina', 'Deltrametrina', 'Lambda-chyhalotrin', 'Imidacloprid', 'Malathion'],
            'Nicosulfuron': [],
            'Tifensulfuron - methyl': [],
            'Glifosato': []
        };
        // Devuelve true si los productos son compatibles, false de lo contrario
        return (compatibilityData[product1] && compatibilityData[product1].includes(product2)) ||
               (compatibilityData[product2] && compatibilityData[product2].includes(product1));
    }
});
