# Backend

## 20230327

### Entity Model

@startuml

skinparam dpi 300
skinparam linetype ortho

object User {
    * wallet : string <<PK>>
}
object Image { 
    * blockchain_adress : string <<PK>>
    --
    * user : number <<FK>>
    * name : string <<required>>
}
object Transaction {
    * transaction_id : number <<PK>> <<generated>>
    --
    * user1 : number <<FK>>
    * user2 : number <<FK>>
    * amount : number <<required>>
}

Transaction }o-u-|| User
Image }o-u-|| User

@enduml
