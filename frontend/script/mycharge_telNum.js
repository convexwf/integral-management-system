function mycharge(id){
		tel = document.getElementById("telNum").value;
		$.ajax({
			type: "POST",
			url: "http://110.64.69.104/IntegralSystemServer/Process_business.php",	
			dataType: "json",
			async:true,
			data:{"tel":tel,"businessID":id},
			success:function (back){ 
				//alert(back.status);
				if(back.status==0){
					alert("充值成功");
					window.location.href="main.html";
				}
				if(back.status==-4){
					alert(back.info);
				}
				else if(back.status==-3){
					alert(back.info);
				}
				else if(back.status==-2){
					alert(back.info);
				}
				else if(back.status==-1){
					alert(back.info);	
				}
				
			},
			error:function(back){
				alert("网络错误,请稍后再试");
			}
		});
	}