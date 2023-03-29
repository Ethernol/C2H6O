# Backend

## 20230327

### Entity Model

@startuml

skinparam dpi 300
skinparam linetype ortho

object User {
    * id: objectId <<PK>> <<generated>>
    --
    * address : objectId <<FK>>
}
object Image { 
    * id : objectId <<PK>> <<generated>>
    --
    * adress : objectId <<FK>>
    * user : objectId <<FK>>
    * name : string <<unique>> <<required>>
}
object Transaction {
    * id : objectId <<PK>> <<generated>>
    --
    * user1 : objectId <<FK>>
    * user2 : objectId <<FK>>
    * amount : number <<required>>
}

object Address {
    * id : objectId <<PK>> <<generated>>
    --
    * address : string <<unique>> <<required>>
}

Transaction "0..*" -u- "2" User
Image "0..*" --- "1" User
User "1" -u- "1" Address
Image "1" -u- "1" Address

@enduml

### Process Diagram of Funding and Transactions

@startuml

skinparam dpi 300

actor User
participant Image
actor Owner
actor "New owner" as C2

User -> Image : sends ether to\nblockchain account\nof image
Image -> Owner : forwards to\nblockchain account\nof owner
User -> Image : paints pixels\non the image
Owner -> C2 : is free to give image

@enduml

