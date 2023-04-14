const base_url = 'http://localhost:3000';

type stringOrNumber = string | number;

class EthernolDBService {
    private toJSON(
        variableNames: string | string[],
        variableValues: string | string[] | stringOrNumber[]
    ): string {
        let JSONString = '';

        if (Array.isArray(variableNames) && Array.isArray(variableValues)) {
            if (variableNames.length !== variableValues.length) {
                const err = 'Lists must be of equal length';
                console.error(err);
                return err;
            }

            (variableNames as string[])
                .map((item: string, index: number) => [
                    item,
                    variableValues[index]
                ])
                .forEach((tuple) => {
                    const [name, value] = tuple;
                    if (typeof value === 'number')
                        JSONString += `"${name}": ${value},`;
                    else JSONString += `"${name}": "${value}",`;
                });
            JSONString = '{' + JSONString.slice(0, -1) + '}';
        } else {
            JSONString = `{"${variableNames}": "${variableValues}"}`;
        }
        return JSON.parse(JSONString);
    }

    private async getData(method = 'GET', url = '') {
        const response = await fetch(url, {
            method: method, // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        })
            .then((response) => response)
            .catch((err) => {
                console.error(err);
                return err;
            });
        return (response as Response).json();
    }

    private async postData(method = 'POST', url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: method, // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
            .then((response) => response)
            .catch((err) => {
                console.error(err);
                return err;
            });
        return (response as Response).json();
    }

    private async forwardHelper(method = 'GET', end_url = '', data = '') {
        const url = base_url + end_url;
        const response =
            method === 'GET' || method === 'DELETE'
                ? await this.getData(method, url)
                : await this.postData(method, url, data);
        if (response.error !== undefined) {
            console.error(response.error);
            return response.error as string;
        }
        return response;
    }

    private async createNew(payload: string, end_url = '/address/create') {
        return await this.forwardHelper('POST', end_url, payload);
    }

    public async createNewAddress(address: string) {
        const payload = this.toJSON('address', address);
        return await this.createNew(payload);
    }

    public async createNewUser(userAddress: string) {
        const address_id: string = await this.createNewAddress(userAddress)
            .then((response) => {
                console.log(`Created Address with\nid ${response.result._id}`);
                return response.result._id;
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
        const payload = this.toJSON('address_id', address_id);
        this.createNew(payload, '/user/create')
            .then((response) => {
                console.log(
                    `Created User with\naddress_id ${response.result.address_id}\nand own id ${response.result._id}`
                );
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
    }

    public createNewImage(
        imageAddress: string,
        imageName: string,
        userAddress: string
    ) {
        this.createNewAddress(imageAddress)
            .then(async (response) => {
                console.log(`Created Address with\nid ${response.result._id}`);

                const address_id: string = response.result._id;
                const user_id = await this.getUserIdFromUserAddress(
                    userAddress
                );

                const payload = this.toJSON(
                    ['address_id', 'image_name', 'user_id'],
                    [address_id, imageName, user_id]
                );

                this.createNew(payload, '/image/create')
                    .then((response) => {
                        console.log(
                            `Created Image with\naddress_id ${response.result.address_id},\nimage_name ${response.result.image_name} and\nuser_id ${response.result.user_id}`
                        );
                    })
                    .catch((err) => {
                        console.error(err);
                        return err;
                    });
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
    }
    public async createNewTransaction(
        addressFrom: string,
        addressTo: string,
        amount: number
    ) {
        const from_id = await this.getUserIdFromUserAddress(addressFrom)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                console.error(err);
                return err;
            });

        const to_id = await this.getUserIdFromUserAddress(addressTo)
            .then((response) => {
                return response;
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
        const payload = this.toJSON(
            ['from_id', 'to_id', 'amount'],
            [from_id, to_id, amount]
        );
        this.createNew(payload, '/transaction/create')
            .then((response) => {
                console.log(
                    `Created User with
from_id ${response.result.from_id}
to_id ${response.result.to_id}
amount ${response.result.amount}
and own id ${response.result._id}`
                );
            })
            .catch((err) => {
                console.error(err);
                return err;
            });

        // For testing
        // const expected = JSON.parse(
        //     `{"from_id": "64349c87e95c4dd619426722", "to_id": "64350f823dfe47bef92c586e", "amount": 10}`
        // );
        // console.log(JSON.stringify(payload) === JSON.stringify(expected));
    }
    private async getUserIdFromUserAddress(
        userAddress: string
    ): Promise<string> {
        const address_id = await this.forwardHelper(
            'GET',
            `/address/getIdByAddress/${userAddress}`
        )
            .then((response): string => {
                return response.result[0]._id;
            })
            .catch((err) => {
                console.error(err);
                return err;
            });
        return await this.forwardHelper(
            'GET',
            `/user/getByAddressId/${address_id}`
        )
            .then((response): string => {
                return response.result[0]._id;
            })
            .catch((err: Error) => {
                console.error(err);
                return err as unknown as string;
            });
    }
}

export const ethernolDBService = new EthernolDBService();

// Usage example for all models
// createNewAddress('blockchain_address');
// createNewUser('blockchain_address');
// getUserByIdFromUserAddress('blockchain_address');
// createNewImage("new_image_address", "imageName", 'userAddress');
// createNewTransaction('blockchain_address_id_from', 'blockchain_address_id_to', 10);
