function RSAAlgorithm(pwd){
	//1.首先选择两个简单的质数p,q
	var p = 61;
	var q = 53;
	var n = p*q;//3233
	//随机选择e,保证e与(p-1)*(q-1)=3120互质
	var e = 17;
	
	
	//找到模反元素d,保证e*d ==1 mod (p-1)*(q-1)
	var d = 2753;
	
	//公钥(n,e),私钥(n,d);
	var text = pwd;//明文,也是密码
	var entext = RSA_encrypt(pwd,n,e); //加密用公钥
	
	var detext = RSA_decrypt(entext,n,d);
	
	return entext;
}

function getMod(a,b,n){
	var i,r=1;
	for(i=1;i<=b;i++){
		r=((r%n)*(a%n))%n;
	}
	return r;	
}
function RSA_encrypt(m,n,e){
	var c = getMod(m,e,n);
	return c;
	
}
function RSA_decrypt(c,n,d){
	var m = getMod(c,d,n);
	return m;
}


