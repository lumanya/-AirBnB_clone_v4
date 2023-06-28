$(document).ready(function () {

  /*****************************************************
    display list of checkboxes clicked
   *****************************************************/
  let ls_amen = {};
  $('input[type=checkbox]').change(function () {
    if ($(this).is(':checked')) {
      ls_amen[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete ls_amen[$(this).data('id')];
    }
    $('.amenities h4').text(Object.values(ls_amen).join(', '));
  });

  /*******************************************************
    display red circle on top right of page if status ok
   *******************************************************/
  $.ajax({
    type: 'GET',
    url: 'http://0.0.0.0:5001/api/v1/status/',
    dataType: 'json',
    success: function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }
  });

  /*******************************************************
    populate Places from frontend, instead of backend jinja
   *******************************************************/
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({}),
    contentType: 'application/json',
    success: (data) => {
			data.forEach((place) =>
				$("section.places").append(
					`<article>
			<div class="title_box">
			<h2>${place.name}</h2>
			<div class="price_by_night">$${place.price_by_night}</div>
			</div>
			<div class="information">
			<div class="max_guest">${place.max_guest} Guest${
						place.max_guest !== 1 ? "s" : ""
					}</div>
			<div class="number_rooms">${place.number_rooms} Bedroom${
						place.number_rooms !== 1 ? "s" : ""
					}</div>
			<div class="number_bathrooms">${place.number_bathrooms} Bathroom${
						place.number_bathrooms !== 1 ? "s" : ""
					}</div>
			</div> 
			<div class="description">
			${place.description}
			</div>
				</article>`
				)
			);
		},
  });

  /*******************************************************
    populate Places from frontend, instead of backend jinja;
    filter places displayed based on amenity checkboxed list
   *******************************************************/
  $('button').click(function () {
    $('article').remove();
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({ 'amenities': Object.keys(ls_amen) }),
      contentType: 'application/json',
      success: (data) => {
        data.forEach((place) =>
          $("section.places").append(
            `<article>
        <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
        <div class="max_guest">${place.max_guest} Guest${
              place.max_guest !== 1 ? "s" : ""
            }</div>
        <div class="number_rooms">${place.number_rooms} Bedroom${
              place.number_rooms !== 1 ? "s" : ""
            }</div>
        <div class="number_bathrooms">${place.number_bathrooms} Bathroom${
              place.number_bathrooms !== 1 ? "s" : ""
            }</div>
        </div> 
        <div class="description">
        ${place.description}
        </div>
          </article>`
          )
        );
      },
    });
  });

});