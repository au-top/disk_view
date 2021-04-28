enum sizeUnit{
    B=1,
    KB=sizeUnit.B*1024,
    MB=sizeUnit.KB*1024,
    GB=sizeUnit.MB*1024,
    T=sizeUnit.GB*1024,
}
export {
    sizeUnit
}