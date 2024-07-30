import { Event } from "../models/event.model.js";
import { Product } from "../models/product.model.js";
import { shuffle } from "../services/event.service.js";
import cloudinary from "cloudinary";

export const createEvent = async (req, res) => {
  try {
    const { eventProductImg, startTime, endTime, productId } = req.body;

    if (!startTime || !endTime || !productId || !eventProductImg) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    if (startDateTime > endDateTime) {
      return res
        .status(400)
        .json({ message: "Start time must be before end time" });
    }

    const isLiveEvent = await Event.findOne({ eventStatus: "Live" });

    if (isLiveEvent) {
      return res.status(400).json({ message: "A live event already exists" });
    }

    const product = await Product.findByIdAndUpdate(productId, {
      $set: { inEvent: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await cloudinary.v2.uploader.upload(eventProductImg, {
      folder: "events",
    });

    const ImgData = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await Event.create({
      eventProductImg: ImgData,
      startTime,
      endTime,
      productId,
    });

    res.status(201).json({ message: "Event Created Successfully" });
  } catch (error) {
    console.log("event controller error (createEvent) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const stopEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.eventStatus !== "Live") {
      return res.status(400).json({ message: "Event is not live" });
    }

    if (new Date(event.endTime) > new Date()) {
      return res.status(400).json({ message: "Event in timezone" });
    }

    await Product.findByIdAndUpdate(event.productId, {
      $set: { inEvent: false },
    });

    const shuffledUsersArray = shuffle(event.usersList);

    if (!shuffledUsersArray) {
      const winnerClient = "";
      event.winnerClient = winnerClient;
    } else {
      const winnerClient = shuffledUsersArray[0];
      event.winnerClient = winnerClient;
    }

    // UPDATE EVENT DATA
    event.eventStatus = "Over";
    await event.save();

    res.status(200).json({ message: "Event stopped successfully" });
  } catch (error) {
    console.log("event controller error (stopEvent) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAdminEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.log("event controller error (getAdminEvents) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAdminSingleEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.log(
      "event controller error (getAdminSingleEvent) :",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ eventStatus: "Live" }).select(
      "-eventStatus -winnerClient -usersList",
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ event });
  } catch (error) {
    console.log("event controller error (getUserEvent) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updatedEventData = req.body;
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const startDateTime = new Date(updatedEventData.startTime);
    const endDateTime = new Date(updatedEventData.endTime);

    if (startDateTime > endDateTime) {
      return res
        .status(400)
        .json({ message: "Start time must be before end time" });
    }

    if (updatedEventData.productId !== event.productId) {
      const product = await Product.findByIdAndUpdate(
        updatedEventData.productId,
        {
          $set: { inEvent: true },
        },
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await Product.findByIdAndUpdate(event.productId, {
        $set: { inEvent: false },
      });
    }

    if (!updatedEventData.eventProductImg.url) {
      await cloudinary.v2.uploader.destroy(event.eventProductImg.public_id);

      const result = await cloudinary.v2.uploader.upload(
        updatedEventData.eventProductImg,
        {
          folder: "events",
        },
      );

      updatedEventData.eventProductImg = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await Event.findByIdAndUpdate(id, updatedEventData);

    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    console.log("event controller error (updateEvent) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Product.findByIdAndUpdate(event.productId, {
      $set: { inEvent: false },
    });

    await cloudinary.v2.uploader.destroy(event.eventProductImg.public_id);

    await Event.findByIdAndDelete(id);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.log("event controller error (deleteEvent) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
