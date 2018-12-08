
注意点：
	（1）所有ID（账户ID，积分ID，礼品ID等）都作为当前表的唯一主键，而且默认数据类型为定长字符串（16位）。
	（2）ID 16位，为了区分ID类型，前两位为特殊字段，三到十四位为入网时间，十五十六位随机 账户为 "AC**********", 账户为 "IG**********"，依次类推，礼品字段为PS，积分记录为IC，兑换记录为PE，优先级字段为PR，业务字段为BS
	（3）所有积分类型固定为int（6），6为显示宽度，比如6显示为 “000006”，不代表实际数据大小。
	（4）所有业务分为七种，签到（记为1001），话费充值（记为1002），办理套餐（记为1003），购买流量包（记为1004），参与积分回馈活动（记为1005），兑换礼品（记为1006），积分过期（记为1010）
	（5）积分类型分为三大类，签到积分（记为2001），消费积分（话费积分2002，套餐积分2003，流量积分2004），活动回馈积分（记为2005），其他记为2006
	（6）礼品类型分为三种，自有类（3001），合作类（3002），实体类（3003），自有类默认数量和价值都是-1，合作类默认价值是-1.
	（8）一个账户绑定有一个签到积分实体，一个话费积分实体，其他积分实体均是多个
	
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

> Account					账户Table			数据类型			属性限制
> ├ userID					账户ID				char(16)			not null | unique | primary key
> ├ password				登录密码	    	varchar		    	not null
> ├ realName				真实姓名	    	varchar         	
> ├ netInDate				入网日期        	date		    	not null
> ├ birth					出生年月	    	date		    	
> ├ telephone				联系电话        	char(11)	    	not null | unique
> ├ address					地址	        	varchar	        	
> ├ levelPoints				账户经验	    	int(6)		    	not null
> ├ level			    	账户等级	    	int(4)		    	not null
> ├ currentBalance			现有总积分	    	int(6)		    	not null
> ├ currentIntegral			现有余额			int(6)				not null
>——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ trigger
> ├——Auto_insert_Account						BEFORE	INSERT		# 插入账户实体时只需要手机号码和密码，其他自动生成		
> ├——Auto_generate_signInIntegral				AFTER	INSERT		# 插入账户实体后自动生成签到积分实体（2001）
> ├——Auto_generate_telefareIntegral				AFTER	INSERT		# 插入账户实体后自动生成话费积分实体（2001）
>——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ procedure(or function)
> ├——insert_Account						IN _telephone CHAR(11), IN _password VARCHAR(255)
> ├——update_Account_address				IN _userID CHAR(16), IN _address VARCHAR(255)
> ├——update_Account_password			IN _userID CHAR(16), IN _password VARCHAR(255)
> ├——update_Account_realName			IN _userID CHAR(16), IN _realName VARCHAR(255)
> ├——change_Account_currentBalance		IN _userID CHAR(16), IN change_balance INT
> ├——change_Account_levelPoints			IN userID_in CHAR(16), IN change_levelPoints INT

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

> Business					业务Table			数据类型			属性限制
> ├ businessID				业务ID				CHAR(16)			not null | unique | primary key
> ├ issueDate				发布日期			date 				not null
> ├ businessName			业务名称			varchar				not null | unique
> ├ businessType			业务类型			int(4)				not null 
> ├ changeBalance			余额变化			int(6)				
> ├ changeIntegral			积分变化			int(6)
> ├ changeLevelPoints		等级经验变化		int(6)
>——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ trigger
> ├——Auto_insert_Business						BEFORE 	INSERT		# 插入业务实体时自动插入发布时间
>——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ procedure(or function)
> ├——process_Business					IN _userID CHAR(16), IN _businessID CHAR(16), IN _presentID CHAR(16)

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

> Integral					积分Table			数据类型			属性限制
> ├ integralID				积分ID				char(16)			not null | unique | primary key
> ├ userID			        账户ID	            char(16)			not null | foreign key
> ├ integralType	        积分类型	        int(4)				not null
> ├ value			        分值	            int(6)				not null
> ├ startDate		        获得日期            date				not null
> ├ expDate			        截止日期	        date				not null
>——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ trigger
> ├——Auto_insert_Integral						BEFORE	INSERT		# 插入积分实体时只需要账户ID，积分分值，积分类型和失效日期，其他自动填充
> ├——insert_value_to_currentIntegral			AFTER	INSERT		# 插入积分实体时自动更新对应账户的现有总积分
> ├——update_value_to_currentIntegral			AFTER	UPDATE		# 更新积分实体时自动更新对应账户的现有总积分
> ├——insert_ifnotexpDate_rollback				BEFORE	INSERT		# 不允许插入过期的积分实体
> ├——update_ifnotexpDate_rollback				BEFORE	UPDATE		# 不允许更新过期的积分实体
>———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ procedure(or function)
> ├——insert_Integral					IN _userID CHAR(16), IN _value INT, IN _integralType INT, IN _expDate
> ├——update_Integral_expDate			IN _integralID CHAR(16), IN _expDate DATE
> ├——change_Integral_value				IN _integralID CHAR(16), INOUT change_value INT

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

> IntegralChangeRecord		积分记录Table		数据类型			属性限制
> ├ changeID				积分记录ID			char(16)			not null | unique | primary key
> ├ integralID              积分ID              char(16)            not null | foreign key 
> ├ changeValue             变化分值	        int(6)              not null                
> ├ changeTime              变化时间            datetime            not null                   
> ├ reason                  变化原因            CHAR(16)            not null | foreign key            
> ├ reasonExtra		        原因补充	        char(12)    
>——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ trigger
>———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ procedure(or function)
> ├——Auto_Insert_ICR					CHAR(16) = (_integralID CHAR(16), _changeValue INT, _reason CHAR(16))
> ├——update_ICR_reasonExtra				IN ICRID CHAR(16), IN _reasonExtra CHAR(16)

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

> Priority					优先级Table			数据类型			属性限制
> ├ priorityID				优先级ID			char(16)			not null | unique | primary key
> ├ changeTime	            更改时间		    datetime	        not null
> ├ First_pr	            第一优先级（1）	    int(4)		        not null
> ├ Second_pr	            第二优先级（2）	    int(4)		        not null
> ├ Third_pr	            第三优先级（3）	    int(4)		        not null
> ├ Fourth_pr	            第四优先级（4）	    int(4)		        not null
> ├ Fifth_pr	            第五优先级（5）	    int(4)		        not null
> ├ Sixth_pr	            第六优先级（6）	    int(4)		        not null
>——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ trigger
> ├——Auto_insert_Priority						BEFORE	INSERT		# 插入优先级时只需要各个积分类型的优先级，其他自动填充
>——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ procedure(or function)
> ├——GetPriority						OUT First INT, OUT Second INT, OUT Third INT, OUT Fourth INT, OUT Fifth INT, OUT Sixth INT		

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
> Present					礼品Table			数据类型			属性限制
> ├ presentID				礼品ID				char(16)			not null | unique | primary key	
> ├ presentName		        礼品名              varchar		        not null | unique
> ├ presentType		        礼品类型            int(4)              not null 
> ├ presentPrice	        礼品价值            double(10,2)        not null                
> ├ costIntegral	        消耗积分            int(6)              not null                     
> ├ presentNum			    礼品数量            int(8)              not null            
>——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ trigger
> ├——Auto_insert_Present						BEFORE	INSERT		# 插入礼品时只需要给出礼品名，礼品类型，礼品价值，消耗积分和礼品数量，其他自动填充
> ├——update_presentNum_to_PER					AFTER	UPDATE		# 礼品数量减少（限定减少1）时自动向兑换记录插入记录
>———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ procedure(or function
> ├——insert_Present						IN _presentName VARCHAR(200), IN _presentType INT, IN _presentPrice INT, IN _costIntegral INT, IN _presentNum INT
> ├——update_Present_costIntegral		IN _presentID CHAR(16), IN _costIntegral INT
> ├——update_Present_presentNum			IN _presentID CHAR(16), IN _presentNum INT
> ├——update_Present_presentPrice		IN _presentID CHAR(16), IN _presentPrice INT

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

> PresentExchangeRecord		兑换记录Table		数据类型			属性限制
> ├ exchangeID				兑换记录ID			char(16)			not null | unique | primary key	
> ├ presentID	            礼品ID	            char(16)    		not null | foreign key 
> ├ exchangeTime            兑换日期	        datetime			not null
>——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ trigger
>———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
> ├ procedure(or function

$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

Procedure(or functions)
> ├ Others
> ├——AutoGenerateID			CHAR(16) = 	(pretype char(2))
> ├——ApplyIntegral			IN _userID CHAR(16), IN needCostIntegral INT, IN reasonID CHAR(16), IN _reasonExtra CHAR(16)
> ├——ExchangePresent		IN _userID CHAR(16), IN _presentID CHAR(16)
> ├——