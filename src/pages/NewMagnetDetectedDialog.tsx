import { useEffect, useState } from 'react'
import { Transmission } from '@ctrl/transmission'
import { BanIcon, PlusCircleIcon } from 'lucide-react'
import { MagnetData, magnetDecode, magnetEncode } from '@ctrl/magnet-link'
import { Dialog } from '../components/Dialog'
import { Button } from '../components/Button'

export function useNewMagnetDetected(torrents: any[]) {
    const [detectedMagnet, setDetectedMagnet] = useState<MagnetData>()
    const [detectedMagnets, setDetectedMagnets] = useState<string[]>([])

    // enable clipboard magnet link capturing
    useEffect(() => {
        const magnets: string[] = torrents.map((torr: any) => torr.raw.magnetLink)

        const onFocus = () => {
            navigator.clipboard.readText().then(copiedText => {
                const decoded = magnets.map(magnet => magnetDecode(magnet).infoHash)
                const magnet = magnetDecode(copiedText)

                if (magnet.infoHash && !decoded.includes(magnet.infoHash) && !detectedMagnets.includes(copiedText)) {
                    setDetectedMagnet(magnet)
                    setDetectedMagnets(exi => [...exi, copiedText])
                }
            })
        }

        window.addEventListener('focus', onFocus)

        return () => {
            window.removeEventListener('focus', onFocus)
        }
    }, [torrents, detectedMagnets])

    return {
        detectedMagnet,
        detectedMagnets,
        setDetectedMagnet,
        setDetectedMagnets,
    }
}

interface NewMagnetDetectedDialog extends ReturnType<typeof useNewMagnetDetected> {
    client: Transmission
}

export function NewMagnetDetectedDialog(props: NewMagnetDetectedDialog) {
    const { client, detectedMagnet, setDetectedMagnet } = props

    const dummy = () => true
    const close = () => setDetectedMagnet(undefined)

    return <Dialog title='New magnet link' control={{ close, open: dummy, toggle: dummy, isOpen: Boolean(detectedMagnet) }}>
        {detectedMagnet?.dn && <div className='flex flex-col space-y-8 text-slate-700 md:space-y-4 dark:text-neutral-300'>
            <p className='break-all md:py-2'>Would you like to add <strong className='font-semibold text-black dark:text-white'>{detectedMagnet.dn}</strong> which is in your clipboard?</p>

            <div className='flex space-x-2'>
                <Button
                    text='Cancel'
                    variant='secondary'
                    icon={<BanIcon />}
                    onClick={close}
                />
                <Button
                    text='Add now'
                    variant='primary'
                    icon={<PlusCircleIcon />}
                    onClick={() => {
                        client.addMagnet(magnetEncode(detectedMagnet))
                        close()
                    }}
                />
            </div>
        </div>}
    </Dialog>
}