import { ENV } from "../../constants";
import ORDERS from "../../schemas/orders";
import REGIONALORDERS from "../../schemas/regional-orders";
import USERS from "../../schemas/users";
import { BotCtx } from "../../types/context";
import handlerProvider, { getPercent, replyWithBoldText } from "../../utils/functions";


const handler = async (ctx: BotCtx) =>{
    const user = await USERS.findOne({chatId: ctx.from.id});
    const isAvailable =  (ctx.from.id === ENV.adminId || user && user.status === "admin");
    if(!isAvailable){
        replyWithBoldText(ctx, "Sizga ushbu statistikani ko'rish uchun ruhsat yo'q");
        return
    }

    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let fullYear = `${year}-${month < 10 ? '0' + month : month}-01`;

    const acceptedOrders = await ORDERS.find({createdAt: { $gte: new Date(fullYear), $lte: new Date() },status: "accepted"}).select("summa");
    const acceptedRegionalOrders = await REGIONALORDERS.find({createdAt: { $gte: new Date(fullYear), $lte: new Date() },status: "accepted"}).select("summa");
    if(!acceptedOrders.length && !acceptedRegionalOrders.length){
      replyWithBoldText(ctx, "Hali buyurtmalar mavjud emas");
      return
    }
    const totalOrdersSum = acceptedOrders.reduce((acc, order) => acc + order.summa, 0);
    const totalOrdersBenefit = acceptedOrders.reduce((acc, order) => acc + getPercent(order.summa, order.summa >= 20000 ? ENV.minPercent : ENV.percent), 0);

    const totalRegionalOrdersSum = acceptedRegionalOrders.reduce((acc, order) => acc + order.summa, 0);
    const totalRegionalOrdersBenefit = acceptedRegionalOrders.reduce((acc, order) => acc + getPercent(order.summa, ENV.minPercent), 0);

    const totalSumma = Number(totalOrdersSum) + Number(totalRegionalOrdersSum);
    const totalBenefit = Number(totalOrdersBenefit) + Number(totalRegionalOrdersBenefit); 
    
    const pendingOrders = await ORDERS.find({createdAt: { $gte: new Date(fullYear), $lte: new Date() },status: "pending"}).select("summa");
    const pendingRegionalOrders = await REGIONALORDERS.find({createdAt: { $gte: new Date(fullYear), $lte: new Date() },status: "pending"}).select("summa");

    const pendingOrdersSum = pendingOrders.reduce((acc, order) => acc + order.summa, 0);
    const pendingOrdersBenefit = pendingOrders.reduce((acc, order) => acc + getPercent(order.summa, order.summa >= 20000 ? ENV.minPercent : ENV.percent), 0);

    const pendingRegionalOrdersSum = pendingRegionalOrders.reduce((acc, order) => acc + order.summa, 0);
    const pendingRegionalOrdersBenefit = pendingRegionalOrders.reduce((acc, order) => acc + getPercent(order.summa, ENV.minPercent), 0);

    const pendingSumma = Number(pendingOrdersSum) + Number(pendingRegionalOrdersSum);
    const pendingBenefit = Number(pendingOrdersBenefit) + Number(pendingRegionalOrdersBenefit);

    replyWithBoldText(ctx, `Ushbu oydagi daromad:\n\nJami buyurtmalar narxi: ${totalSumma}\nSof foyda : ${totalBenefit}\n\nKutilvotgan buyurtmalar narxi: ${pendingSumma}\nKutilvotgan sof foyda : ${pendingBenefit}`);
}

const monthlyBenefit = ctx => handlerProvider(ctx, handler);
export default monthlyBenefit;