const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true, 
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    isEmailVerified: { 
        type: Boolean, 
        default: false 
    },
    emailVerificationToken: { 
        type: String 
    },
    telegramUsername: { 
        type: String, 
        trim: true,
        match: [/^[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram username']
    },
    phoneNo: { 
        countryCode: { 
            type: String, 
            required: [true, 'Country code is required'],
            match: [/^\+\d{1,4}$/, 'Invalid country code format. Example: +1, +44']
        },
        number: { 
            type: String, 
            required: [true, 'Phone number is required'],
            match: [/^\d{7,15}$/, 'Phone number must be between 7 and 15 digits']
        }
    },
    website: { 
        type: String,
        match: [/^https?:\/\/(www\.)?[\w-]+\.[a-z]{2,}(\/[^\s]*)?$/, 'Invalid website URL']
    },
    country: { 
        type: String, 
        required: [true, 'Country is required'],
        trim: true
    },
    position: { 
        type: String, 
        enum: ['Author', 'Buyer', 'Owner', 'Admin', 'Editor', 'Moderator'],
        required: [true, 'Position is required']
    },
    role: { 
        type: String, 
        enum: ['User', 'Admin', 'SuperAdmin'],
        default: 'User'
    },
    dateOfJoin: { 
        type: Date, 
        default: Date.now 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    profilePictureUrl: { 
        type: String,
        match: [/^https?:\/\/(www\.)?[\w-]+\.[a-z]{2,}(\/[^\s]*)?$/, 'Invalid profile picture URL']
    },
    lastLogin: { 
        type: Date 
    },
    address: { 
        type: String,
        trim: true
    },
    preferences: {
        newsletterSubscribed: { 
            type: Boolean, 
            default: false 
        },
        theme: { 
            type: String, 
            enum: ['light', 'dark'], 
            default: 'light' 
        }
    }
}, { timestamps: true });

// **Manual Indexing Logic** 
// userSchema.index({ email: 1 });


module.exports = mongoose.model('User', userSchema);
