package com.ssalog.service;

import java.util.List;
import java.util.Map;

import com.ssalog.dto.Scrapedpost;

public interface ScrapService {

	public String make_scrap(String username, String Scoring);
	public String stop_scrap(String username, String Scoring);
	public List<Scrapedpost> get_scrapList(String username);
}
