
export const useShowDialogs = (): any => {
    const showInfo = useState<boolean>('showInfo', () => false)
    const dialog = useState<boolean>('dialog', () => false)
    return { showInfo, dialog }
}

