document.addEventListener('DOMContentLoaded', () => {
  const products = document.querySelectorAll('.product-list li');
  const comparisonArea = document.getElementById('comparison-area');
  const compareBtn = document.getElementById('compare-btn');
  const refreshBtn = document.getElementById('refresh-btn');

  let selectedProducts = [];

  products.forEach(product => {
      product.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({
              nombre: e.target.dataset.nombre,
              tipo: e.target.dataset.tipo
          }));
      });
  });

  comparisonArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      comparisonArea.classList.add('over');
  });

  comparisonArea.addEventListener('dragleave', () => {
      comparisonArea.classList.remove('over');
  });

  comparisonArea.addEventListener('drop', (e) => {
      e.preventDefault();
      comparisonArea.classList.remove('over');
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));

      if (selectedProducts.length < 2) {
          if (selectedProducts.some(product => product.tipo === data.tipo)) {
              alert('No puede comparar productos del mismo tipo.');
              return;
          }
          selectedProducts.push(data);
          const productElement = document.querySelector(`li[data-nombre="${data.nombre}"]`);
          productElement.style.display = 'none';
          const productNode = document.createElement('p');
          productNode.textContent = `${data.nombre} (${data.tipo})`;
          comparisonArea.appendChild(productNode);
      }
  });

  compareBtn.addEventListener('click', () => {
      if (selectedProducts.length === 2) {
          const [product1, product2] = selectedProducts;
          const compatibility = checkCompatibility(product1.nombre, product2.nombre);
          alert(`Los productos ${compatibility ? 'son' : 'no son'} compatibles.`);
      } else {
          alert('Por favor, seleccione dos productos de diferentes tipos.');
      }
  });

  refreshBtn.addEventListener('click', () => {
      location.reload();
  });

  function checkCompatibility(product1, product2) {
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
      return (compatibilityData[product1] && compatibilityData[product1].includes(product2)) ||
             (compatibilityData[product2] && compatibilityData[product2].includes(product1));
  }
});
