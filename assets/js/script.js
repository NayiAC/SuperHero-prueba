$(document).ready(function() {

    
    $("form").on("submit", function(e) {
      e.preventDefault();
      let id = parseInt($("#numero").val())
      if (!isValidId(id)) {
        alert("El número debe ser entre 1 y 732");
        return;
      } 
      
    //respuesta de solicitud card 📰, grafico 📊 y falla⛔
      getHeroData(id).done(function(response) {
        heroCard(response) 
  
        for(const power in response.powerstats) {
          if(response.powerstats[power] !== "null") {
            heroChart(response) 
          } else {
            $("#heroChart").html("<p>Este héroe no tiene stats de poder</p>")
          }
        }
      }).fail(function() {
        alert("Error al obtener los datos del superhéroe")
      });
    });
  
    //validar número ingresado por el usuario 🔢: 1.- que sean solo numeros 2.- que el valor este entre 1 y 732
    function isValidId(id) {
      let regex = /^\d+$/ 
      return regex.test(id) && id > 0 && id <= 732 
    }
  
    //consulta a la API 🧐, cambia el número final por el valor ingresado por el usuairo
    function getHeroData(id) {
      const settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://superheroapi.com/api.php/1c369fd3240441da910509b2ee0cbd88/${id}`,
        "method": "GET",
        "dataType": "json",
        "headers": {
          "Accept": "*/*",
        }
      }
  
      return $.ajax(settings)
    }
    
    //crea carta 📝
    function heroCard(response) {
      let heroCard = `
        <div class="card mb-3 border border-primary-subtle shadow" style="max-width: 50rem;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${response.image.url}" class="img-fluid rounded-start h-100 w-100" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${response.name}</h5>
                <p class="card-text">Conexiones: ${response.connections.relatives}</p>
                <em class="card-text"><small class="text-body-secondary">Publicado por: ${response.biography.publisher}</small></em>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Ocupación: ${response.work.occupation}</li>
                <li class="list-group-item">Primera Aparición: ${response.biography["first-appearance"]}</li>
                <li class="list-group-item">Altura: ${response.appearance.height[1]}</li>
                <li class="list-group-item">Peso: ${response.appearance.weight[1]}</li>
                <li class="list-group-item">Alianzas: ${response.connections["group-affiliation"]}</li>
              </ul>
            </div>
          </div>
        </div>
      `
  
      $("#heroCard").html(heroCard);
    }
    
    //crea gráfico "pie" con los poderes 📊🥧
    function heroChart(response) {
      $("#heroChart").CanvasJSChart({
        title: {
          animationEnabled: true,
          text: `Estadísticas de Poder para ${response.name}`,
          fontSize: 28
        },
        data: [
          {
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            dataPoints: [
              {y: response.powerstats.intelligence, label: "Inteligencia"},
              {y: response.powerstats.strength, label: "Fuerza"},
              {y: response.powerstats.speed, label: "Velocidad"},
              {y: response.powerstats.durability, label: "Durabilidad"},
              {y: response.powerstats.power, label: "Poder"},
              {y: response.powerstats.combat, label: "Combate"}
            ]
          }
        ]
      });
    }
  })