import { Buffer } from 'buffer'
import { useCallback } from 'react'
import { FileIcon } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Transmission } from '@ctrl/transmission'

interface NewTorrentProps {
    client: Transmission
}

export function NewTorrent(props: NewTorrentProps) {
    const { client } = props

    const onDrop = useCallback((files: File[]) => {
        window.Buffer = Buffer

        for (const file of files) {
            if (file.name.endsWith('.torrent')) {
                file.arrayBuffer().then(data => client.addTorrent(Buffer.from(data)))
            } else {
                // todo: show a toast that this file is not supported
            }
        }
    }, [client])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return <div {...getRootProps()} className='hidden cursor-pointer col-span-1 relative md:aspect-square bg-white rounded-2xl text-center lg:flex flex-col space-y-2 justify-center items-center dark:bg-neutral-900'>
        <input {...getInputProps()} />

        {!isDragActive && <>
            <div className='flex justify-center items-center'>
                <div className='p-3 flex bg-black/5 rounded-full dark:bg-white/10'>
                    <FileIcon className='w-5 h-5 dark:text-neutral-300' />
                </div>
            </div>
            <div className='px-4'>
                <h4 className='font-semibold'>Drag & drop torrent files here or</h4>
            </div>
            <div className='flex'>
                <button className='text-xs font-medium px-9 py-2 rounded-full transition-colors bg-slate-100 dark:bg-neutral-950'>Browse</button>
            </div>
        </>}

        {isDragActive && <>
            <div className='flex flex-col justify-center items-center space-y-4'>
                <div className='flex'>
                    <svg width="42" height="42" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.2001 2.94972C28.253 2.00263 26.4999 1.9525 25.3817 2.52547C24.4693 2.83877 23.5081 3.19209 22.5278 3.58828L22.5383 3.59883C19.9627 4.69286 16.1108 6.63769 13.0279 9.49984C10.8637 11.5091 9.62366 13.0559 8.79313 14.4647L3.49489 16.4149C2.80991 16.6671 2.6171 17.5444 3.13322 18.0605C6.84572 21.773 10.5582 25.4855 14.2707 29.198C14.7868 29.7141 15.6641 29.5213 15.9163 28.8363L18.1197 22.8504C19.7284 21.8921 21.3425 20.6853 23.0279 18.9999C25.4183 16.6095 27.3936 12.4408 28.5413 9.64309L28.5496 9.65145C28.9506 8.66094 29.3079 7.68963 29.6243 6.76812C30.1973 5.64991 30.3642 4.11384 29.2001 2.94972Z" fill="#CA0B4A" />
                        <path d="M23.2987 4.3645C20.7818 5.4041 16.8206 7.34324 13.7083 10.2327C11.6937 12.103 10.5374 13.5272 9.76899 14.7821C8.99995 16.0381 8.59391 17.1628 8.10621 18.5226L8.10371 18.5296C7.93354 19.0041 7.75311 19.5072 7.54517 20.0441L12.1006 24.5996C15.7031 23.1209 18.8412 21.7724 22.3208 18.2928C24.6722 15.9414 26.6597 11.6505 27.7751 8.87168L23.2987 4.3645Z" fill="#F4F4F4" />
                        <path d="M24.5278 11.25C24.5278 13.0449 23.0727 14.5 21.2778 14.5C19.4828 14.5 18.0278 13.0449 18.0278 11.25C18.0278 9.45507 19.4828 8 21.2778 8C23.0727 8 24.5278 9.45507 24.5278 11.25Z" fill="#9B9B9B" />
                        <path d="M23.5278 11.25C23.5278 12.4926 22.5204 13.5 21.2778 13.5C20.0351 13.5 19.0278 12.4926 19.0278 11.25C19.0278 10.0074 20.0351 9 21.2778 9C22.5204 9 23.5278 10.0074 23.5278 11.25Z" fill="#83CBFF" />
                        <path d="M2.45122 29.6108C1.74411 28.9037 2.02779 24 4.52777 23C4.52777 23 7.02777 22 8.63878 23.6005C10.2498 25.2011 9.52776 26.9999 9.52776 26.9999C8.82068 29.1212 5.81033 29.9645 5.45679 29.6109C5.26153 29.4157 5.61314 29.0602 5.45679 28.9038C5.30045 28.7475 5.05904 28.9259 4.39613 29.2574C3.92473 29.4931 2.73406 29.8937 2.45122 29.6108Z" fill="#FF8257" />
                        <path d="M6.08839 21.0607C6.67417 20.4749 7.62392 20.4749 8.20971 21.0607L11.7452 24.5962C12.331 25.182 12.331 26.1317 11.7452 26.7175C11.1595 27.3033 10.2097 27.3033 9.62392 26.7175L6.08839 23.182C5.5026 22.5962 5.5026 21.6465 6.08839 21.0607Z" fill="#533566" />
                        <path d="M15.5351 18.722C15.977 17.5214 14.8098 16.3542 13.6092 16.7961L6.49489 19.4149C5.80991 19.6671 5.6171 20.5444 6.13322 21.0605L11.2707 26.198C11.7868 26.7141 12.6641 26.5213 12.9163 25.8363L15.5351 18.722Z" fill="#F92F60" />
                    </svg>
                </div>

                <h4 className='text-xl font-medium'>{`Lets's`} go!</h4>
            </div>
        </>}
    </div>
}