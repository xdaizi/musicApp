// 由于数据结构复用性高,所以创建一个song类
// 由于参数过多,所以我们不直接导出类,而是导出一个创建类的方法
import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
class Song {
    constructor({id, mid, singer, name, album, duration, image, url}) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
        this.urlFlag = false // 用来标记是否拿到真正的播放源地址
    }
    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                } else {
                    reject(new Error('no lyric'))
                }
            })
        })
    }
}
// 拼接歌手
function filterSinger(singer) {
    let ret = []
    if (!singer) return ''
    singer.forEach((item) => {
        ret.push(item.name)
    })
    return ret.join('/')
}
export default function createSong(musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://thirdparty.gtimg.com/C100${musicData.songmid}.m4a?fromtag=38`
    })
}