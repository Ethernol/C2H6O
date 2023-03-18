import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma"

export const actions: Actions = {
    createImage: async ({ request }) => {
        const { name, creator, blockchain_address } = Object.fromEntries(await request.fromData()) as {
            name : string
            creator : User
            blockchain_address : string
        }

        try {
            await prisma.image.create({
                data: {
                    name,
                    creator,
                    blockchain_address
                }
            })
        } catch (err){
            console.log(err)
            return fail(500, {message: "Database error"})
        }
        return {
            status: 201
        }
    },
}