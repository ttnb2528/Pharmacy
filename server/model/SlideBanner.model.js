import mongoose from "mongoose";

const SlideBannerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    // required: true,
    default: null,
  },
  deleted: {
    type: Boolean,
    default: false,
  }
});

const SlideBanner = mongoose.model("Slide_Banner", SlideBannerSchema);

export default SlideBanner;
