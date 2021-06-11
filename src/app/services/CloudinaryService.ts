import { config } from '../../config/config';
import { promises } from 'dns';

abstract class CloudinaryService {
    public static readonly cloudinary = require('cloudinary');
    public static readonly configs = {
        cloud_name: config.CLOUDINARY_CLOUD_NAME,
        api_key: config.CLOUDINARY_API_KEY,
        api_secret: config.CLOUDINARY_API_SECRET,
    };

    public static connect(): void {
        this.cloudinary.config(this.configs);
    }

    public static async uploadSingleImage(image: any): Promise<any> {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.cloudinary.v2.uploader.upload(image, { resource_type: "image", height: 250, width: 250, crop: "fit" }, (err: any, url: any) => {
                if (err) return reject(err);
                return resolve(url);
            })
        });
    }
}

export default CloudinaryService;
