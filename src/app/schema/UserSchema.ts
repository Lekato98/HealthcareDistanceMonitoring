import mongoose from 'mongoose';

const schemaDefinition = {
    username: {
        type: String,
        required: true,
        unique: true,
    },
}

const schemaOptions = {
    timestamps: true,
}

const UserSchema = new mongoose.Schema(schemaDefinition, schemaOptions);

export default UserSchema;
