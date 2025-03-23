export type IOrder = {
    districtId: number,
    status: string,
    userId: number,
    driverId: number,
    summa: number,
    from: string,
    to: string,
    messageId: number,
    createdAt: Date
}

export type IRegionalOrder = {
    fromRegionId: number,
    toRegionId: number,
    status: string,
    userId: number,
    driverId: number,
    summa: number,
    from: string,
    to: string,
    messageId: number,
    createdAt: Date
}