import { clsx } from 'clsx'
import { DateTime } from 'luxon'
import { filesize } from 'filesize'
import { useDialog } from './Dialog'
import { BoxButton, Button } from './'
import { Transmission } from '@ctrl/transmission'
import { TorrentInfoDialog } from './TorrentInfoDialog'
import { Bean, Clock, HardDriveDownload, HardDriveUpload, Info, Magnet, Pause, Play, Square, Trash2 } from 'lucide-react'

function ActionButton({ icon, name, onClick, variant }: { variant: 'secondaryDark' | 'danger', icon: React.ReactNode, name: string, onClick: () => any }) {
    return <>
        <Button
            icon={icon}
            text={name}
            variant={variant}
            onClick={onClick}
            className='lg:hidden'
        />
        <BoxButton
            icon={icon}
            text={name}
            variant={variant}
            onClick={onClick}
            className='hidden lg:flex'
        />
    </>
}

interface TorrentCardProps {
    torrent: any,
    client: Transmission,
}

export function TorrentCard({ torrent, client }: TorrentCardProps) {
    const infoDialog = useDialog()

    const formatEta = (seconds: number) => {
        const now = DateTime.now()
        const eta = DateTime.now().plus({ seconds })

        const diff = eta.diff(now)

        if (diff.as('days') > 1) {
            const days = Math.floor(diff.as('days'))
            return `${days} ${days == 1 ? 'day' : 'days'}`
        } else if (diff.as('hours') >= 1) {
            return `${Math.floor(diff.as('hours'))} hr`
        } else if (diff.as('minutes') >= 1) {
            return `${Math.floor(diff.as('minutes'))} min`
        } else {
            return `${Math.floor(diff.as('seconds'))} sec`
        }
    }

    const formatSize = (size: number, hideRate?: boolean) => hideRate ? filesize(size) : `${filesize(size)}/s`

    return <>
        <div key={torrent.id} className='flex flex-col space-y-5 bg-white dark:bg-neutral-700 rounded-3xl p-5 sm:p-6 md:px-8 lg:space-y-0 lg:flex-row'>
            {/* <pre>{JSON.stringify(torrent, null, 4)}</pre> */}
            <div className='flex flex-col space-y-3 lg:grow'>
                <h3 className='line-clamp-1 sm:text-lg'>{torrent.name}</h3>
                <div className='flex flex-col space-y-3'>
                    {/* metrics */}
                    <div className='flex space-x-3 justify-between'>
                        {/* left metrics */}
                        <div className='text-neutral-500 flex gap-2 items-center text-xs flex-wrap dark:text-neutral-300 md:gap-4 lg:gap-5'>
                            {/* time remaining */}
                            {torrent.eta != -1 && <div className='flex space-x-1 items-center'>
                                <Clock className='w-3 h-3 sm:w-4 sm:h-4' />
                                <span>{formatEta(torrent.eta)}</span>
                            </div>}

                            {/* download speed */}
                            {torrent.state == 'downloading' && <div className='flex space-x-1 items-center'>
                                <HardDriveDownload className='w-3 h-3 sm:w-4 sm:h-4' />
                                <span>{formatSize(torrent.downloadSpeed)}</span>
                            </div>}

                            {/* upload speed */}
                            {['seeding', 'downloading'].includes(torrent.state) && <div className='flex space-x-1 items-center'>
                                <HardDriveUpload className='w-3 h-3 sm:w-4 sm:h-4' />
                                <span>{formatSize(torrent.uploadSpeed)}</span>
                            </div>}

                            {/* torrent peers */}
                            {['downloading', 'seeding'].includes(torrent.state) && <div className='hidden md:flex space-x-1 items-center'>
                                <Magnet className='w-3 h-3 sm:w-4 sm:h-4' />
                                <span>{torrent.connectedPeers}/{torrent.totalPeers}</span>
                            </div>}

                            {/* torrent seeds */}
                            {torrent.state == 'downloading' && <div className='hidden md:flex opacity-70 space-x-1 items-center'>
                                <Bean className='w-3 h-3 sm:w-4 sm:h-4' />
                                <span>{torrent.connectedSeeds}/{torrent.totalSeeds}</span>
                            </div>}

                            {/* show paused status */}
                            {torrent.state == 'paused' && <div className='flex opacity-70 space-x-1 items-center'>
                                <span>Paused at {formatSize(torrent.totalDownloaded, true)} out of {formatSize(torrent.totalSelected, true)}</span>
                            </div>}
                        </div>

                        {/* download percent */}
                        <div className='flex space-x-3 items-center text-sm'>
                            <span className='dark:text-neutral-200'>{Number(torrent.progress * 100).toFixed(2)}%</span>
                        </div>
                    </div>

                    {/* progress bar */}
                    <div className='h-1.5 bg-black/5 dark:bg-white/5 rounded-full'>
                        <div className={clsx(
                            // base styles
                            'h-full rounded-full transition-all',

                            // progress styles
                            torrent.state == 'paused' && torrent.isCompleted && 'bg-blue-500',
                            torrent.state == 'downloading' && torrent.isCompleted == false && 'bg-rose-500',
                            torrent.state == 'seeding' && torrent.isCompleted && 'bg-emerald-400'
                        )} style={{ width: `${Number(torrent.progress * 100).toFixed(2)}%` }} />
                    </div>
                </div>
            </div>

            {/* torrent controls */}
            <div className="flex flex-row-reverse justify-end lg:flex-row lg:space-x-3 lg:ml-6">
                {/* delete the torrent */}
                {torrent.state != 'downloading' && <ActionButton
                    name='Delete'
                    variant='danger'
                    icon={<Trash2 />}
                    onClick={() => client.removeTorrent(torrent.id, false)}
                />}

                {/* torrent info */}
                <ActionButton
                    name='Info'
                    icon={<Info />}
                    variant='secondaryDark'
                    onClick={infoDialog.open}
                />

                {/* start paused torrents */}
                {torrent.state == 'paused' && <ActionButton
                    name='Start'
                    icon={<Play />}
                    variant='secondaryDark'
                    onClick={() => client.resumeTorrent(torrent.id)}
                />}

                {/* paused downloading torrents */}
                {torrent.state == 'downloading' && <ActionButton
                    name='Pause'
                    icon={<Pause />}
                    variant='secondaryDark'
                    onClick={() => client.pauseTorrent(torrent.id)}
                />}

                {/* stop seeding torrents */}
                {torrent.state == 'seeding' && <ActionButton
                    name='Stop'
                    icon={<Square />}
                    variant='secondaryDark'
                    onClick={() => client.pauseTorrent(torrent.id)}
                />}
            </div>
        </div>

        <TorrentInfoDialog
            torrent={torrent}
            control={infoDialog}
            title='Torrent info'
        />
    </>
}