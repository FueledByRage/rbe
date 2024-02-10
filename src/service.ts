import { prisma } from './db'; 

export const executeTransaction = async ( transactionRequest : ITransactionRequest )=>{
    if(transactionRequest.descricao.length > 10) throw new Error();

    const user = await prisma.users.findUnique({
        where: {
            id: transactionRequest.id,
            limite: { gte: transactionRequest.valor },
        }
    });

    if(!user || !userCanExecuteTransaction(user, transactionRequest.valor) ) throw new Error();

    await prisma.transactions.create({
        data:{
            tipo: transactionRequest.tipo.toString(),
            user_id: transactionRequest.id,
            valor: transactionRequest.valor,
            descricao: transactionRequest.descricao,
            realizada_em: new Date(),
        }
    });

    return {
        limite: user.limite,
        saldo: user.saldo,
    }
}

export const getExtract = async ( userId : string )=>{
    const usuario = await prisma.users.findUnique({
        where: {
            id: userId,
        }
    });

    if(!usuario) throw new Error();

    const ultimas_transacoes = await prisma.transactions.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            realizada_em: 'desc',
        },
        take: 10,
    });

    return{
        saldo:{
            total: usuario.saldo,
            data_extrato: new Date(),
            limite: usuario.limite,
        },
        ultimas_transacoes
    }
}



export interface ITransactionRequest{
    id: string;
    valor: number;
    tipo: TipoTransacao;
    descricao: string;
}

export enum TipoTransacao{
    d,
    c
}

const userCanExecuteTransaction = ( user : any, valor: number )=>{
    return user.saldo - valor >= user.limite;
}