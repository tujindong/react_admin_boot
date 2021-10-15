/**
 * 定义封装localStorage常用方法
 */
const storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    get(key) {
        return JSON.parse(localStorage.getItem(key));
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};
export default storage;