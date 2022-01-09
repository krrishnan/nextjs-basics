import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const currentWorkingDirectory = process.cwd();
const postsDirectory = path.join(currentWorkingDirectory, 'posts');
const fileNames = fs.readdirSync(postsDirectory);

export const getAllPostsData = () => {
    const allPostsData = fileNames.map(getPostDataFromFile);
    return sortByDate(allPostsData);
}

export const getPostData = async ( postId ) => {
    const fileName = postId + '.md';
    const postDataAndContent = await getPostDataAndContentFromFile(fileName);
    return postDataAndContent; 
}

export const getAllPostIds = () => fileNames.map(getPostIdFromFile);


const getPostIdFromFile = fileName => {
    const fileNameWithoutExtension = removeFileExtension(fileName);
    return { params : { postId : fileNameWithoutExtension}};
}

const getPostDataFromFile = (fileName) => {
    const id = removeFileExtension(fileName);
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    
    const matterResult = matter(fileContents);
    return {
        id, ...matterResult.data
    }
}
const getPostDataAndContentFromFile = async (fileName) => {
    const id = removeFileExtension(fileName);
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    
    const matterResult = matter(fileContents);
    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHTML = processedContent.toString();

    return {
        id, contentHTML, ...matterResult.data
    }
}
const sortByDate = (postsData) => {
    return postsData.sort(({ date: a }, { date: b }) => a < b);
}
function removeFileExtension(fileName) {
    return fileName.replace(/\.md$/, '');
}