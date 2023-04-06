import authController from './auth.controller.js'
describe('AuthController checkPassword method: ',()=>{

    it('should return true, when called with proper password as argument',()=>{
        expect(authController.checkPassword('Q@wertyuiop123@!')).toBe(true);
    })

    it('should return false, when called with weak password as argument',()=>{
        expect(authController.checkPassword('dsa')).toBe(false)
    })

    it('should throw error when called without argument',()=>{
        expect(()=>authController.checkPassword('')).toThrow('Missing requiered argument unhashed password');
        expect(()=>authController.checkPassword(null)).toThrow('Missing requiered argument unhashed password');
        expect(()=>authController.checkPassword(undefined)).toThrow('Missing requiered argument unhashed password');
        expect(()=>authController.checkPassword()).toThrow('Missing requiered argument unhashed password');

    })

})

describe('AuthController checkUsername method: ',()=>{

    it('should return true, when called with proper password as argument',()=>{
        expect(authController.checkUsername('Username')).toBe(true);
    })

    it('should return false, when called with weak password as argument',()=>{
        expect(authController.checkUsername('dsa')).toBe(false)
    })

    it('should throw error when called without argument',()=>{
        expect(()=>authController.checkUsername('')).toThrow('Missing requiered argument username');
        expect(()=>authController.checkUsername(null)).toThrow('Missing requiered argument username');
        expect(()=>authController.checkUsername(undefined)).toThrow('Missing requiered argument username');
        expect(()=>authController.checkUsername('')).toThrow('Missing requiered argument username'); 
    })

})
