const fs = require('fs'); //REQUERIMOS EL MODULO FILE SYSTEM (fs es un módulo nativo de Node.js que permite interactuar con los archivos del sistema)
const path = require('path'); //REQUERIMOS EL MODULO PATH QUE GUARDA FILE SYSTEM (para poder trabajar con rutas relativas y absolutas)

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
//en la variable productsFilePath hacemos uso del metodo join de path que sirve para unir rutas
//y le pasamos como primer parametro __dirname que encuentra la ruta desde la raiz y como segundo parametro la ruta del archivo a utilizar

console.log(productsFilePath)//ejemplo de lo que trae la variable productsFilePath
//C:\Users\Fran\OneDrive\Escritorio\Formar\Trabajos Practicos\Mercado-Liebre\src\data\productsDataBase.json

const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {

	//CONTROLADOR QUE HACE LA LOGICA QUE VAMOS A PODER VER EN LA VISTA  PRINCIPAL

	index: (req, res) => {
		//recorremos los poductos con un foreach y filtramos el o los productos
		//cuya categoria sea igual al valor "in-sale" y lo guardamos en una variable
		//para mandarla a la vista
		let productsInSale = products.filter(product => product.category === "in-sale");
		let productsVisited = products.filter(product => product.category === "visited");
		//filtramos los productos que en su elemento category sea igual a "visited"
		res.render('index', {
			productsInSale,
			productsVisited,
			toThousand
		})
		//todo esto para poder renderizarlo en la vista index.ejs
	},
	search: (req, res) => {
		//creamos un array vacio para poder guardar lo que tenga el metodo includes del query string(cadena de consulta)
		//en la variable result y lo pase a la vista headerNavBar para poder buscar los productos en el input
		//de la vista principal
		//agregamos el metodo toLowerCase para que el input reconozca palabras en may. y min.
		let result = [];

		products.forEach(product => {
			if(product.name.toLowerCase().includes(req.query.keywords.toLowerCase())) {
				result.push(product)
			}
		//Si la letra o palabra buscada por query string se encuentra
		//incluida en el nombre del producto, la pusheamos(guardamos) en la variable result
		});

		//Si el largo del array que esta dentro de la variable (result) es distinto de 0
		//significa que encontro productos relacionados.
		//Renderizamos la vista results.ejs(resultados) en el primer parametro,
		//y le pasamos como segundo parametro un objeto con el resultado de la busqueda,
		//la variable result.
		if(result.length !== 0) {
			res.render('results', {
				result,
				toThousand, //funcion que cada tres numero agrega un punto al precio
				search: req.query.keywords,
				//en la variable search le pasamos la palabra exacta que busco el usuario
				//esta variable la creamos para poder trabajar en la vista results.ejs
			})
		}
	},
};

module.exports = controller;
//exportamos las funciones que guarda el objeto controller para poder requerirlas
