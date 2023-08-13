import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const authSchema = new Schema({
    who: {
        type: Schema.Types.UUID,
        ref: function () {
            return this.whoType;
        },
        required: true,
        unique: true
    },
    whoType: {
        type: String,
        enum: ['Admin', 'User', 'Editor'],
        default: 'User', // Set a default account type
    },
    authType: {
        type: String,
        enum: ['PASSWORD', 'FACEBOOK_OAUTH', 'GOOGLE_OAUTH'],
        default: 'PASSWORD'
    },
    accessToken: {

    },
    refreshToken: {
        type: String
    },
    secret: {
        type: String,
        required: true,
    }

}, { timestamps: true });

authSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt();
        this.secret = await bcrypt.hash(this.secret, salt);
        next();
    } catch (error) {
        console.log(error);
        throw error('Something Wrong Happened');
    }
})

const Auth = model('auth', authSchema);
export default Auth