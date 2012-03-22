function applet_actions_cached(id)
 {

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    getCategoriesList_cache(id);
    getHeaderFooter_cache(id);

    $("#applet_id").val(id);
    $("#submission_id").val(id);

    var who = $.cookie('who');
    if (who) {
        $("#name").val(who.name);
        $("#email").val(who.email);
    }
	var url_count = $.cookie('url_count');
	if(url_count)
	{
		$('#sync_when_online').append('('+url_count+')');
	}

    $('#form_submit').click(function() {
 	    navigator.geolocation.getCurrentPosition(onSuccess, onError);

         who_am_i = {name : document.getElementById("name").value, email : document.getElementById("email").value}
         
         $.cookie('who', who_am_i, { expires: 2592000000 });
         
 	    var serialized_submission = $("#form_serial").serialize();
 	    
 	    console.log(serialized_submission);
 	    
 	    var url_count = $.cookie('url_count');
     	new_url_count = url_count + 1;
 	    $.cookie('url_count', new_url_count, { expires: 2592000000 });
 	    
 	    count_local =  new_url_count+'url';
 	     
 	    localStorage.setItem(count_local, serialized_submission);
 	        
         $('#form_serial').hide();
         $('#success_message').show();


         $('#camera_image').click(function() {
            alert('You cannot upload photos when not connected to the internet')
         });
         $('#lib_image').click(function() {
            alert('You cannot upload photos when not connected to the internet')
         });

     	
       return false;
     });

	

}


function syncOnline()
{
    
    var url_count = $.cookie('url_count');

    count_url = 1;
    while (count_url<=url_count)
      {
          
          localname = count_url+'url';
          form_data = localStorage.getItem(localname);
          
          var full_url = serviceURL + 'submit_from_phonegap?jsoncallback=?&' + form_data;
	      $.getJSON(full_url,
	      {
	          format: "jsonp"
	        },
          
	       function(data) {

                      console.log('success'+data)
                      localStorage.removeItem(localname);

	      });
	      
	      count_url++;
	    }
	$.cookie('url_count', null);
	alert('Offline Locations have been synced.')

}


function getCategoriesList_cache(id) {
	
	cat_name = id+'cat';
	categories = JSON.parse(localStorage.getItem(cat_name));
	
	$.each(categories, function(index, categories) {
		$('#parse_category').append('<option value="' + categories.id + '">' + categories.name + '</option>');
	});
	$("select#parse_category").selectmenu('refresh');

}

function getHeaderFooter_cache(id) {
	head_name = id+'head';
	header = JSON.parse(localStorage.getItem(head_name));
	
	$('#applet_name').html(header.name);
    $('#applet_desc').html(header.desc);
    $('title').prepend(header.name);

}