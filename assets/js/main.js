
var data_id = [];
var i = 1;
$(document).ready(function($) {

    var data = firebase.database().ref('/absensi');

    data.on('value', (snapshot) => {

        item = snapshot.val();
        $.each(item,function(index) {

            fetchData(item[index],i);
            i++; 
            
        });

        

        // $.each(item['tugas'], function(index) {
        //     loopData(item['tugas'][index]);

        // });

    });
   



});



$('#btn-submit').click(function(event) {

    var _tanggal = $('#_tanggal').val();
    var _kelas = $('#_kelas').val();
    var _mapel = $('#_mapel').val();
    var _id = firebase.database().ref('absensi/').push().key;

    var data = {

        tanggal: _tanggal,
        kelas: _kelas,
        mapel: _mapel,   
             
        id: _id,
    }
    $('#_tanggal').val("");
    $('#_kelas').val("");
    $('#_mapel').val("");

    submitData(data);


});


function submitData(data) {
	i = 1;
    firebase.database().ref('/absensi/' + data['id']).set(data);

}


function fetchData(data,index){
    var data_absensi ;
    var status = ["Hadir","Sakit","Dispensasi"];
	if(data_id.includes(data['id'])){

		return;

	}else {

		var html = "<tr>"
                    +"<td scope='row'>"+index+"</td>"
                    +"<td>"+data['tanggal']+"</td>"
                    +"<td>"+data['kelas']+"</td>"
                    +"<td>"+data['mapel']+"</td>"
                    +"<td>"
                    	+"<button class='btn btn-sm btn-info' data-toggle='modal' onclick='getData(\""+data['id']+"\")' data-target='#editModal'>Edit</button>"
                    	+"<button class='btn btn-sm btn-danger ml-1 btn-delete' onclick='deleteData(\""+data['id']+"\")' >Hapus</button>"
                    +'</td>'
               +"</tr>";

        if("kehadiran" in data)
        {
            data_absensi = 
        "<div id='accordion' class='accordion'>"
            +"<div class='card mb-0'>"
                +"<div class='card-header bg-danger text-light collapsed' data-toggle='collapse' href='#"+data['id']+"'>"
                    +"<a class='card-title'>"
                       +"<span> <b>"+data['kelas']+"</b>  </span>  <span class=' ml-5'>"+data['tanggal']+"</span> <span class=' ml-5'>"+data['mapel']+"</span>"  

                    +"</a>"
        
                +"</div>"
                +"<div id='"+data['id']+"' class='card-body collapse' data-parent='#accordion'>"
                    +"<hr>"
                        +"<li>"+data['kehadiran']['nama']+" <span class='ml-5'>"+data['kehadiran']['status']+"</span></li>"
                    +"<hr>"
                +"</div>"
              
            +"</div>"
        +"</div>  <hr> ";

        }else{

          data_absensi =  "<div id='accordion' class='accordion'>"
            +"<div class='card mb-0'>"
                +"<div class='card-header bg-danger text-light collapsed' data-toggle='collapse' href='#"+data['id']+"'>"
                    +"<a class='card-title'>"
                       +"<span> <b>"+data['kelas']+"</b>  </span>  <span class=' ml-5'>"+data['tanggal']+"</span> <span class=' ml-5'>"+data['mapel']+"</span>"  

                    +"</a>"
        
                +"</div>"
                +"<div id='"+data['id']+"' class='card-body collapse' data-parent='#accordion'>"
                    +"<hr>"
                        +"<li>Tidak ada data</li>"
                    +"<hr>"
                +"</div>"
              
            +"</div>"
        +"</div>  <hr> ";
        }


        
         var absensi = 
        "<div id='accordion' class='accordion'>"
            +"<div class='card mb-0'>"
                +"<div class='card-header bg-danger text-light collapsed' data-toggle='collapse' href='#"+data['id']+"'>"
                    +"<a class='card-title'>"
                       +"<span> <b>"+data['kelas']+"</b>  </span>  <span class=' ml-5'>"+data['tanggal']+"</span> <span class=' ml-5'>"+data['mapel']+"</span>"  

                    +"</a>"
        
                +"</div>"
                +"<div id='"+data['id']+"' class='card-body collapse' data-parent='#accordion'>"
                +"<div class='row'>"
                +"<button class='btn btn-success mr-2' onclick='submitKehadiran(\""+data['id']+"\",\""+"Hadir"+"\")'>Hadir</button>"
                +"<button class='btn btn-warning mr-2' onclick='submitKehadiran(\""+data['id']+"\",\""+"Sakit"+"\")'>Sakit</button>"
                +"<button class='btn btn-dark mr-2'onclick='submitKehadiran(\""+data['id']+"\",\""+"Dispensasi"+"\")'>Dispensasi</button>"
                +"</div>"
                +"</div>"
              
            +"</div>"
        +"</div>  <hr> ";


   $('#table-body').append(html);
   $('.list-jadwal').append(data_absensi);

   console.log($('.submit-kehadiran').children().length);

   if(data['kehadiran'] == undefined){
        $('.submit-kehadiran').append(absensi);
   }
   
   if($('.submit-kehadiran').children().length == 0){
    $('.submit-kehadiran').html('<center id="no-data">Tidak ada data / sudah di submit</center>');
    }else{
        $('#no-data').remove();
    }


	}
    data_id.push(data['id']);
    $('#total-jadwal').text(data_id.length);

}


function getData(id)
{
	var data = [];
	firebase.database().ref('/absensi/' + id).once('value').then((snapshot)=>{

		data.push(snapshot.val());
		$('#_tanggalEdit').val(data[0]['tanggal']);
		$('#_kelasEdit').val(data[0]['kelas']);
		$('#_mapelEdit').val(data[0]['mapel']);
		$('#_idEdit').val(data[0]['id']);

			
	});	

}


function updateData()
{


	var _tanggal = $('#_tanggalEdit').val();
    var _kelas = $('#_kelasEdit').val();
    var _mapel = $('#_mapelEdit').val();
	var _id = $('#_idEdit').val();

    

    var data = {

        tanggal: _tanggal,
        kelas: _kelas,
        mapel: _mapel,        
    	
    }
    $('#_tanggalEdit').val("");
    $('#_kelasEdit').val("");
    $('#_mapelEdit').val("");

    firebase.database().ref('/absensi/' + _id).update(data);

    window.location.reload();


}

function submitKehadiran(id,status)
{
    var data = {

        kehadiran: {
            nama : "siswa 1",
            status : status,
        }       
    	
    }

    firebase.database().ref('/absensi/' + id).update(data);

    window.location.reload();
}

function deleteData(id)
{
    firebase.database().ref('/absensi/' + id).remove();
    window.location.reload();


}

