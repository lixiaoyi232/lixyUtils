import { Story } from '../entities/story'


export async function addImgPropertyToStories(stories: Story[]) {
  for (let s of stories) {
    s.content = JSON.parse(s.content)
    for (let block of s.content as any) {
      if (block.type === 'image') {
        (s as any).img = block.url
        break
      }
    }
    if (!(s as any).img) {
      (s as any).img = '/static/images/website/story08.jpg'
    }
  }
}
